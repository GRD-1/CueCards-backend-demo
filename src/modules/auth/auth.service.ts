import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@/modules/jwt/jwt.service';
import { TokenTypeEnum } from '@/modules/jwt/jwt.interfaces';
import { EmailType, IAuthResult, IGenerateTokenArgs } from '@/modules/auth/auth.interfaces';
import { IUserWithPassword } from '@/modules/user/user.interface';
import {
  EMAIL_MSG,
  EMAIL_OCCUPIED_MSG,
  INVALID_CODE_ERR_MSG,
  INVALID_CREDENTIALS_ERR_MSG,
  LOGOUT_MSG,
  RESET_PASS_EMAIL_MSG,
  SIGNUP_MSG,
  UNCONFIRMED_EMAIL_ERR_MSG,
  USED_PASSWORD_ERR_MSG,
} from '@/modules/auth/auth.constants';
import { compare, hash } from 'bcrypt';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { MailerService } from '@/modules/mailer/mailer.service';
import { emailConfig } from '@/config/configs';
import { ConfigType } from '@nestjs/config';
import { UserRepo } from '@/modules/prisma/repositories/user.repo';
import dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(emailConfig.KEY)
    private emailConf: ConfigType<typeof emailConfig>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly userRepo: UserRepo,
  ) {}

  public async signUp(userData: IUserWithPassword): Promise<string> {
    const { email, nickname, avatar, password } = userData;
    const hashedPass = await hash(password, 10);

    const emailIsOccupied = await this.userRepo.findOneByEmail(email);
    if (emailIsOccupied) {
      throw new CueCardsError(CCBK_ERROR_CODES.UNIQUE_VIOLATION, EMAIL_OCCUPIED_MSG);
    }

    await this.userRepo.create({ email, avatar, password: hashedPass, nickname });
    await this.sendCode(userData.email, EmailType.Confirmation);

    return SIGNUP_MSG;
  }

  public async sendEmail(email: string, type: EmailType): Promise<string> {
    await this.userRepo.findOneWithCredentialsByEmail(email);
    await this.sendCode(email, type);

    return EMAIL_MSG;
  }

  public async confirm(email: string, code: string): Promise<IAuthResult> {
    const cachedCode = await this.cacheManager.get(`code:${EmailType.Confirmation}:${email}`);

    if (cachedCode !== code) {
      throw new CueCardsError(CCBK_ERROR_CODES.BAD_REQUEST, INVALID_CODE_ERR_MSG);
    }
    const user = await this.userRepo.confirm(email);
    const [accessToken, refreshToken] = await this.generateAuthTokens({ user });

    return { accessToken, refreshToken };
  }

  public async signIn(email: string, password: string, domain?: string): Promise<IAuthResult> {
    const user = await this.userRepo.findOneWithCredentialsByEmail(email);
    const passwordApproved = await compare(password, user.credentials!.password);

    if (!passwordApproved) {
      throw new CueCardsError(CCBK_ERROR_CODES.INVALID_CREDENTIALS, INVALID_CREDENTIALS_ERR_MSG);
    }
    if (!user.confirmed) {
      throw new CueCardsError(CCBK_ERROR_CODES.UNCONFIRMED_EMAIL, UNCONFIRMED_EMAIL_ERR_MSG);
    }
    const [accessToken, refreshToken] = await this.generateAuthTokens({ user, domain });

    return { accessToken, refreshToken };
  }

  public async sendCode(email: string, type: EmailType): Promise<void> {
    const user = await this.userRepo.findOneWithCredentialsByEmail(email);
    const cacheKey = `code:${type}:${user.email}`;
    const cacheValue = Math.floor(1000 + Math.random() * 9000).toString();

    if (type === EmailType.Confirmation) {
      await this.mailerService.sendConfirmationEmail(user.email, user.nickname, cacheValue);
    } else {
      await this.mailerService.sendResetPasswordEmail(user.email, user.nickname, cacheValue);
    }

    await this.cacheManager.set(cacheKey, cacheValue, { ttl: this.emailConf.ttl } as any);
  }

  private async generateAuthTokens(args: IGenerateTokenArgs): Promise<[string, string]> {
    return Promise.all([
      this.jwtService.generateToken({ ...args, tokenType: TokenTypeEnum.ACCESS }),
      this.jwtService.generateToken({ ...args, tokenType: TokenTypeEnum.REFRESH }),
    ]);
  }

  public async logout(accessToken: string, refreshToken: string): Promise<string> {
    const { tokenId: refreshId, exp: refExp } = await this.jwtService.verifyToken(refreshToken, TokenTypeEnum.REFRESH);
    const { tokenId: accessId, exp: accExp } = await this.jwtService.decodeJwt(accessToken);

    await this.blacklistToken(refreshId, refExp);
    await this.blacklistToken(accessId, accExp);

    return LOGOUT_MSG;
  }

  private async blacklistToken(tokenId: string, exp?: number): Promise<void> {
    const now = dayjs().unix();
    const expiration = exp || dayjs().unix();
    const ttl = expiration - now;

    if (ttl > 0) {
      await this.cacheManager.set(`blacklist:${tokenId}`, now.toString(), { ttl } as any);
    }
  }

  public async resetPassword(email: string): Promise<string> {
    await this.userRepo.findOneWithCredentialsByEmail(email);
    await this.sendCode(email, EmailType.Reset);

    return RESET_PASS_EMAIL_MSG;
  }

  public async confirmReset(email: string, code: string, password: string): Promise<IAuthResult> {
    const user = await this.userRepo.findOneWithCredentialsByEmail(email);
    const cachedCode = await this.cacheManager.get(`code:${EmailType.Reset}:${email}`);
    const hashedPass = await hash(password, 10);
    const theSamePassword = await compare(password, user.credentials!.password);

    if (cachedCode !== code) {
      throw new CueCardsError(CCBK_ERROR_CODES.BAD_REQUEST, INVALID_CODE_ERR_MSG);
    }
    if (theSamePassword) {
      throw new CueCardsError(CCBK_ERROR_CODES.BAD_REQUEST, USED_PASSWORD_ERR_MSG);
    }

    await this.userRepo.updatePassword(user.id, hashedPass);
    const [accessToken, refreshToken] = await this.generateAuthTokens({ user });

    return { accessToken, refreshToken };
  }

  // public async updatePassword(userId: number, oldPass: string, newPass: string): Promise<IAuthResult> {
  //   const user = await this.userRepo.updatePassword(userId, oldPass, newPass);
  //   const [accessToken, refreshToken] = await this.generateAuthTokens({ user });
  //
  //   return { user, accessToken, refreshToken };
  // }

  // public async refreshTokenAccess(refreshToken: string, domain?: string): Promise<IAuthResult> {
  //   const { id, version, tokenId } = await this.jwtService.verifyToken(refreshToken, TokenTypeEnum.REFRESH);
  //   await this.checkIfTokenIsBlacklisted(id, tokenId);
  //   const user = await this.usersService.findOneById(id);
  //   if (isUndefined(user) || isNil(user) || user?.credentials?.version !== version) {
  //     throw new CueCardsError(CCBK_ERROR_CODES.UNAUTHORIZED, 'Invalid token');
  //   }
  //   const [accessToken, newRefreshToken] = await this.generateAuthTokens({ user, domain, tokenId });
  //
  //   return { user, accessToken, refreshToken: newRefreshToken };
  // }
  //
  // private async checkIfTokenIsBlacklisted(userId: number, tokenId: string): Promise<void> {
  //   const time = await this.cacheManager.get(`blacklist:${userId}:${tokenId}`);
  //
  //   if (!isUndefined(time) && !isNil(time)) {
  //     throw new CueCardsError(CCBK_ERROR_CODES.UNAUTHORIZED, 'Invalid token');
  //   }
  // }
}
