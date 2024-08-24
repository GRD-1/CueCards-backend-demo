import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@/modules/jwt/jwt.service';
import { UserService } from '@/modules/user/user.service';
import { TokenTypeEnum } from '@/modules/jwt/jwt.interfaces';
import { IAuthResult, IGenerateTokenArgs } from '@/modules/auth/auth.interfaces';
import { IUserWithPassword } from '@/modules/user/user.interface';
import { LOGOUT_MSG, RESET_PASS_EMAIL_MSG, RESET_PASS_MSG, SIGNUP_MSG } from '@/modules/auth/auth.constants';
import { hash } from 'bcrypt';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { isNil, isUndefined } from '@nestjs/common/utils/shared.utils';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import dayjs from 'dayjs';
import { MailerService } from '@/modules/mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  private async generateAuthTokens(args: IGenerateTokenArgs): Promise<[string, string]> {
    return Promise.all([
      this.jwtService.generateToken({ ...args, tokenType: TokenTypeEnum.ACCESS }),
      this.jwtService.generateToken({ ...args, tokenType: TokenTypeEnum.REFRESH }),
    ]);
  }

  public async signUp(userData: IUserWithPassword, domain?: string): Promise<string> {
    const user = await this.usersService.create(userData);
    const confirmationToken = await this.jwtService.generateToken({
      user,
      tokenType: TokenTypeEnum.CONFIRMATION,
      domain,
    });
    await this.mailerService.sendConfirmationEmail(user.email, user.nickname, confirmationToken);

    return SIGNUP_MSG;
  }

  // public async singIn(email: string, password: string, domain?: string): Promise<IAuthResult> {
  //   const hashedPass = await hash(password, 10);
  //   const user = await this.usersService.findOneByEmail(email);
  //   const userPassHash = user?.credentials?.password;
  //
  //   if (hashedPass !== user?.credentials?.password) {
  //     throw new CueCardsError(CCBK_ERROR_CODES.INVALID_CREDENTIALS, 'Invalid credentials');
  //   }
  //   if (!user.confirmed) {
  //     const confirmationToken = await this.jwtService.generateToken({
  //       user,
  //       tokenType: TokenTypeEnum.CONFIRMATION,
  //       domain,
  //     });
  //     this.mailerService.sendConfirmationEmail(user, confirmationToken);
  //     throw new CueCardsError(CCBK_ERROR_CODES.UNAUTHORIZED, 'Please confirm your email');
  //   }
  //   const [accessToken, refreshToken] = await this.generateAuthTokens({ user, domain });
  //
  //   return { user, accessToken, refreshToken };
  // }
  //
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
