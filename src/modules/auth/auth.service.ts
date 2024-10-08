import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@/modules/jwt/jwt.service';
import { CustomJwtPayload, TokenTypeEnum } from '@/modules/jwt/jwt.interfaces';
import {
  EmailType,
  IAuthResult,
  IGenerateTokenArgs,
  IUpdatePasswordArgs,
  IUserWithPassword,
} from '@/modules/auth/auth.interfaces';
import {
  DELETE_USER_MSG,
  EMAIL_MSG,
  EMAIL_OCCUPIED_ERR_MSG,
  FORBIDDEN_ACTION_ERR_MSG,
  INVALID_CODE_ERR_MSG,
  INVALID_CREDENTIALS_ERR_MSG,
  INVALID_TOKEN_ERR_MSG,
  LOGOUT_MSG,
  NOT_FOUND_ERR_MSG,
  RESET_PASS_EMAIL_MSG,
  SUSPICIOUS_TOKEN_ERR_MSG,
  UNCONFIRMED_EMAIL_ERR_MSG,
  USED_PASSWORD_ERR_MSG,
} from '@/constants/messages.constants';
import { compare, hash } from 'bcrypt';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { MailerService } from '@/modules/mailer/mailer.service';
import { emailConfig, nodeConfig, userConfig } from '@/config/configs';
import { ConfigType } from '@nestjs/config';
import { UserRepo } from '@/modules/prisma/repositories/user.repo';
import { CredentialsEntity } from '@/modules/user/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(emailConfig.KEY)
    private emailConf: ConfigType<typeof emailConfig>,
    @Inject(nodeConfig.KEY)
    private nodeConf: ConfigType<typeof nodeConfig>,
    @Inject(userConfig.KEY)
    private userConf: ConfigType<typeof userConfig>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly userRepo: UserRepo,
  ) {}

  public async signUp(userData: IUserWithPassword): Promise<string> {
    const { email, nickname, avatar, password } = userData;
    const hashedPass = await hash(password, 10);

    const emailIsOccupied = await this.userRepo.findOneByEmail(email);
    if (emailIsOccupied) {
      throw new CueCardsError(CCBK_ERROR_CODES.UNIQUE_VIOLATION, EMAIL_OCCUPIED_ERR_MSG);
    }

    await this.sendCode(userData.email, EmailType.Confirmation, nickname);
    const user = await this.userRepo.create({ email, avatar, password: hashedPass, nickname });

    return user.id;
  }

  public async sendEmail(email: string, type: EmailType): Promise<string> {
    await this.userRepo.findOneWithCredentialsByEmail(email);
    await this.sendCode(email, type);

    return EMAIL_MSG;
  }

  public async confirmEmail(email: string, code: string): Promise<IAuthResult> {
    const cachedCode = await this.cacheManager.get(`code:${EmailType.Confirmation}:${email}`);

    if (cachedCode !== code) {
      throw new CueCardsError(CCBK_ERROR_CODES.BAD_REQUEST, INVALID_CODE_ERR_MSG);
    }
    const { id, credentials } = await this.userRepo.confirm(email);
    this.checkCredentialsExistence(credentials);

    return this.generateAuthTokens({ userId: id, version: credentials.version });
  }

  public async signIn(email: string, password: string, domain?: string): Promise<IAuthResult> {
    const { id, confirmed, credentials } = await this.userRepo.findOneWithCredentialsByEmail(email);
    this.checkCredentialsExistence(credentials);
    const version = credentials.version;

    await this.validatePassword(credentials.password, password);
    if (!confirmed) {
      throw new CueCardsError(CCBK_ERROR_CODES.UNCONFIRMED_EMAIL, UNCONFIRMED_EMAIL_ERR_MSG);
    }

    return this.generateAuthTokens({ userId: id, version, domain });
  }

  public async sendCode(email: string, type: EmailType, nickname?: string): Promise<void> {
    const cacheValue = Math.floor(1000 + Math.random() * 9000).toString();
    let cacheKey: string;

    if (type === EmailType.Confirmation) {
      cacheKey = `code:${type}:${email}`;
      await this.mailerService.sendConfirmationEmail(email, cacheValue, nickname);
    } else {
      const user = await this.userRepo.findOneWithCredentialsByEmail(email);
      cacheKey = `code:${type}:${user.email}`;
      await this.mailerService.sendResetPasswordEmail(user.email, user.nickname, cacheValue);
    }

    await this.cacheManager.set(cacheKey, cacheValue, { ttl: this.emailConf.ttl } as never);
  }

  private async generateAuthTokens(args: IGenerateTokenArgs): Promise<IAuthResult> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.generateToken({ ...args, tokenType: TokenTypeEnum.ACCESS }),
      this.jwtService.generateToken({ ...args, tokenType: TokenTypeEnum.REFRESH }),
    ]);

    return { accessToken, refreshToken };
  }

  private checkCredentialsExistence(value: CredentialsEntity | null): asserts value is CredentialsEntity {
    if (!value) {
      throw new CueCardsError(CCBK_ERROR_CODES.RECORD_NOT_FOUND, NOT_FOUND_ERR_MSG);
    }
  }

  public async logout(accessToken: string, refreshToken: string): Promise<string> {
    const { tokenId: refreshId, exp: refExp } = await this.jwtService.verifyToken(refreshToken, TokenTypeEnum.REFRESH);
    const { tokenId: accessId, exp: accExp } = await this.jwtService.decodeJwt(accessToken);

    await this.jwtService.blacklistToken(refreshId, refExp);
    await this.jwtService.blacklistToken(accessId, accExp);

    return LOGOUT_MSG;
  }

  public async resetPassword(email: string): Promise<string> {
    const { id } = await this.userRepo.findOneWithCredentialsByEmail(email);
    this.checkUserAccess(id);
    await this.sendCode(email, EmailType.Reset);

    return RESET_PASS_EMAIL_MSG;
  }

  public async confirmReset(email: string, code: string, password: string): Promise<IAuthResult> {
    const { id: userId, credentials } = await this.userRepo.findOneWithCredentialsByEmail(email);
    this.checkCredentialsExistence(credentials);
    const { password: storedPassword, lastPassword: storedLastPassword } = credentials;
    const cachedCode = await this.cacheManager.get(`code:${EmailType.Reset}:${email}`);

    this.checkUserAccess(userId);
    await this.validatePassword(storedPassword, password, true);
    const newPasswordHash = await this.validatePassword(storedLastPassword, password, true);

    if (cachedCode !== code) {
      throw new CueCardsError(CCBK_ERROR_CODES.BAD_REQUEST, INVALID_CODE_ERR_MSG);
    }

    const { version } = await this.userRepo.updatePassword(userId, storedPassword, newPasswordHash);

    return this.generateAuthTokens({ userId, version });
  }

  public async updatePassword(args: IUpdatePasswordArgs): Promise<IAuthResult> {
    const { accessToken: currentAccToken, refreshToken: currentRefToken, currentPassword, newPassword } = args;
    const { sub: userId, tokenId: accessId, exp: accExp } = await this.jwtService.decodeJwt(currentAccToken);
    const { tokenId: refreshId, exp: refExp } = await this.jwtService.decodeJwt(currentRefToken);

    this.checkUserAccess(userId);

    const { credentials } = await this.userRepo.findOneByIdOrThrow(userId);
    this.checkCredentialsExistence(credentials);
    const { password: storedPassword, lastPassword: storedLastPassword } = credentials;

    const oldPasswordHash = await this.validatePassword(storedPassword, currentPassword);
    const newPasswordHash = await this.validatePassword(storedLastPassword, newPassword, true);

    const { version } = await this.userRepo.updatePassword(userId, oldPasswordHash, newPasswordHash);

    await this.jwtService.blacklistToken(accessId, accExp);
    await this.jwtService.blacklistToken(refreshId, refExp);

    return this.generateAuthTokens({ userId, version });
  }

  public async validatePassword(storedPassword: string, password: string, isPasswordNew?: boolean): Promise<string> {
    const passwordHash = await hash(password, 10);
    const isEqual = await compare(password, storedPassword);
    const invalidPassword = isPasswordNew ? isEqual : !isEqual;
    if (invalidPassword) {
      if (isPasswordNew) {
        throw new CueCardsError(CCBK_ERROR_CODES.BAD_REQUEST, USED_PASSWORD_ERR_MSG);
      } else {
        throw new CueCardsError(CCBK_ERROR_CODES.INVALID_CREDENTIALS, INVALID_CREDENTIALS_ERR_MSG);
      }
    }

    return passwordHash;
  }

  public async refreshTokens(tokenPayload: CustomJwtPayload): Promise<IAuthResult> {
    const { sub: userId, version, jti, exp } = tokenPayload;

    const user = await this.userRepo.findOneById(userId);
    if (!user || !user.credentials) {
      this.logger.error(SUSPICIOUS_TOKEN_ERR_MSG);
      throw new CueCardsError(CCBK_ERROR_CODES.UNAUTHORIZED, INVALID_TOKEN_ERR_MSG);
    }
    if (user.credentials.version !== version) {
      await this.jwtService.blacklistToken(jti, exp);
      throw new CueCardsError(CCBK_ERROR_CODES.UNAUTHORIZED, INVALID_TOKEN_ERR_MSG);
    }

    return this.generateAuthTokens({ userId, version });
  }

  public async delete(userId: string): Promise<string> {
    this.checkUserAccess(userId);
    await this.userRepo.delete(userId);

    return DELETE_USER_MSG;
  }

  private checkUserAccess(userId: string): void {
    const forbiddenId = [this.userConf.testUserId, this.userConf.defaultUserId].includes(userId);
    if (this.nodeConf.mode === 'development' && forbiddenId) {
      throw new CueCardsError(CCBK_ERROR_CODES.FORBIDDEN, FORBIDDEN_ACTION_ERR_MSG);
    }
  }
}
