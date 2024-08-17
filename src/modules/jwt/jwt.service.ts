import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { Inject, Injectable } from '@nestjs/common';
import { appConfig, jwtConfig } from '@/config/configs';
import { ConfigType } from '@nestjs/config';
import {
  IAccessPayload,
  IEmailPayload,
  IGenerateTokenArgs,
  IGenerateTokenAsyncArgs,
  IRefreshPayload,
  IVerifyTokenArgs,
  PayloadType,
  TokenTypeEnum,
} from '@/modules/jwt/jwt.interfaces';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { v4 } from 'uuid';

@Injectable()
export class JwtService {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConf: ConfigType<typeof jwtConfig>,
    @Inject(appConfig.KEY)
    private appConf: ConfigType<typeof appConfig>,
  ) {}

  private static async jwtSignAsync(args: IGenerateTokenAsyncArgs): Promise<string> {
    const { payload, secret, options } = args;

    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, options, (error, token) => {
        if (error) {
          reject(error);

          return;
        }

        if (token) {
          resolve(token);
        } else {
          reject(new Error('Token generation failed'));
        }
      });
    });
  }

  private static async jwtVerifyAsync<T extends PayloadType>(args: IVerifyTokenArgs): Promise<JwtPayload> {
    const { token, secret, options } = args;

    return new Promise((resolve, rejects) => {
      jwt.verify(token, secret, options, (error, payload: T) => {
        if (error) {
          rejects(error);

          return;
        }
        resolve(payload);
      });
    });
  }

  public async generateToken(args: IGenerateTokenArgs): Promise<string> {
    const { user, tokenType, domain, tokenId } = args;
    let payload: IAccessPayload | IEmailPayload | IRefreshPayload;
    let secret: string;
    const options: jwt.SignOptions = {
      issuer: this.appConf.id,
      subject: user.email,
      audience: domain ?? this.appConf.domain,
      expiresIn: this.jwtConf[tokenType].time,
      algorithm: 'HS256',
    };

    switch (tokenType) {
      case TokenTypeEnum.ACCESS:
        payload = { id: user.id };
        secret = this.jwtConf.access.privateKey;
        options.algorithm = 'RS256';
        break;

      case TokenTypeEnum.REFRESH:
        payload = {
          id: user.id,
          version: user?.credentials?.version,
          tokenId: tokenId ?? v4(),
        };
        secret = this.jwtConf.refresh.secret!;
        break;

      case TokenTypeEnum.CONFIRMATION:
      case TokenTypeEnum.RESET_PASSWORD:
        payload = {
          id: user.id,
          version: user?.credentials?.version,
        };
        secret = this.jwtConf[tokenType].secret!;
        break;

      default:
        throw new CueCardsError(CCBK_ERROR_CODES.INTERNAL_SERVER_ERROR, 'Invalid token type');
    }

    return JwtService.jwtSignAsync({ payload, secret, options }).catch((err) => {
      throw new CueCardsError(CCBK_ERROR_CODES.INTERNAL_SERVER_ERROR, err.message(), err);
    });
  }

  public async verifyToken(token: string, tokenType: TokenTypeEnum): Promise<JwtPayload> {
    let secret: string;
    const options: jwt.VerifyOptions = {
      issuer: this.appConf.id,
      audience: new RegExp(this.appConf.domain!),
      maxAge: this.jwtConf[tokenType].time,
      algorithms: ['HS256'],
    };

    if (tokenType === TokenTypeEnum.ACCESS) {
      secret = this.jwtConf.access.publicKey;
      options.algorithms = ['RS256'];
    } else {
      secret = this.jwtConf[tokenType].secret!;
    }

    return JwtService.jwtVerifyAsync({ token, secret, options }).catch((err) => {
      if (err instanceof jwt.TokenExpiredError) {
        throw new CueCardsError(CCBK_ERROR_CODES.BAD_REQUEST, 'Token expired');
      }
      if (err instanceof jwt.JsonWebTokenError) {
        throw new CueCardsError(CCBK_ERROR_CODES.BAD_REQUEST, 'Invalid token');
      }
      throw new CueCardsError(CCBK_ERROR_CODES.INTERNAL_SERVER_ERROR, err.message(), err);
    });
  }
}
