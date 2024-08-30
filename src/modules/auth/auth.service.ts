import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@/modules/jwt/jwt.service';
import { UserService } from '@/modules/user/user.service';
import { TokenTypeEnum } from '@/modules/jwt/jwt.interfaces';
import { IAuthResult, IGenerateTokenArgs } from '@/modules/auth/auth.interfaces';
import { IUserWithPassword } from '@/modules/user/user.interface';
import { SIGNUP_MSG } from '@/modules/auth/auth.constants';
import { hash } from 'bcrypt';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { MailerService } from '@/modules/mailer/mailer.service';
import { jwtConfig } from '@/config/configs';
import { ConfigType } from '@nestjs/config';
import { UserRepo } from '@/modules/prisma/repositories/user.repo';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(jwtConfig.KEY)
    private jwtConf: ConfigType<typeof jwtConfig>,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly userRepo: UserRepo,
  ) {}

  private async generateAuthTokens(args: IGenerateTokenArgs): Promise<[string, string]> {
    return Promise.all([
      this.jwtService.generateToken({ ...args, tokenType: TokenTypeEnum.ACCESS }),
      this.jwtService.generateToken({ ...args, tokenType: TokenTypeEnum.REFRESH }),
    ]);
  }

  public async signUp(userData: IUserWithPassword): Promise<string> {
    const user = await this.usersService.create(userData);
    const cacheKey = `confirm_code:${user.email}`;
    const cacheValue = Math.floor(1000 + Math.random() * 9000).toString();

    await this.mailerService.sendConfirmationEmail(user.email, user.nickname, cacheValue);
    await this.cacheManager.set(cacheKey, cacheValue, this.jwtConf.confirmation.time);

    return SIGNUP_MSG;
  }

  public async confirm(email: string, code: string): Promise<IAuthResult> {
    const cachedCode = await this.cacheManager.get(`confirm_code:${email}`);

    if (cachedCode !== code) {
      throw new CueCardsError(CCBK_ERROR_CODES.BAD_REQUEST, 'Invalid confirmation code');
    }
    const user = await this.userRepo.confirm(email);
    const [accessToken, refreshToken] = await this.generateAuthTokens({ user });

    return { accessToken, refreshToken };
  }

  public async signIn(email: string, password: string, domain?: string): Promise<IAuthResult> {
    const hashedPass = await hash(password, 10);
    const user = await this.userRepo.findOneWithCredentialsByEmail(email);
    const userPassHash = user.credentials?.password;

    if (hashedPass !== userPassHash) {
      throw new CueCardsError(CCBK_ERROR_CODES.INVALID_CREDENTIALS, 'Invalid credentials');
    }
    if (!user.confirmed) {
      throw new CueCardsError(CCBK_ERROR_CODES.UNCONFIRMED_EMAIL, 'Unconfirmed email');
    }
    const [accessToken, refreshToken] = await this.generateAuthTokens({ user, domain });

    return { accessToken, refreshToken };
  }

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
  //
  // public async logout(refreshToken: string): Promise<string> {
  //   const { id, tokenId, exp } = await this.jwtService.verifyToken(refreshToken, TokenTypeEnum.REFRESH);
  //   await this.blacklistToken(id, tokenId, exp);
  //
  //   return LOGOUT_MSG;
  // }
  //
  // private async blacklistToken(userId: number, tokenId: string, exp?: number): Promise<void> {
  //   const now = dayjs().unix();
  //   const expiration = exp || dayjs().unix();
  //   const ttl = (expiration - now) * 1000;
  //
  //   if (ttl > 0) {
  //     await this.cacheManager.set(`blacklist:${userId}:${tokenId}`, now.toString(), ttl);
  //   }
  // }
  //
  // public async resetPasswordEmail(email: string, domain?: string): Promise<string> {
  //   const user = await this.usersService.findOneByEmail(email);
  //
  //   if (user) {
  //     const resetToken = await this.jwtService.generateToken({
  //       user,
  //       tokenType: TokenTypeEnum.RESET_PASSWORD,
  //       domain,
  //     });
  //     this.mailerService.sendResetPasswordEmail(user, resetToken);
  //   }
  //
  //   return RESET_PASS_EMAIL_MSG;
  // }
  //
  // public async resetPassword(resetToken: string, oldPass: string, newPass: string): Promise<string> {
  //   const { id } = await this.jwtService.verifyToken(resetToken, TokenTypeEnum.RESET_PASSWORD);
  //   await this.usersService.updatePassword(id, oldPass, newPass);
  //
  //   return RESET_PASS_MSG;
  // }
  //
  // public async updatePassword(userId: number, oldPass: string, newPass: string): Promise<IAuthResult> {
  //   const user = await this.usersService.updatePassword(userId, oldPass, newPass);
  //   const [accessToken, refreshToken] = await this.generateAuthTokens({ user });
  //
  //   return { user, accessToken, refreshToken };
  // }
}
