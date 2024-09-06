import * as jwt from 'jsonwebtoken';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { appConfig, jwtConfig } from '@/config/configs';
import { ConfigType } from '@nestjs/config';
import {
  CustomJwtPayload, ICustomFields,
  IGenerateTokenArgs,
  IGenerateTokenAsyncArgs,
  IVerifyTokenArgs,
  TokenTypeEnum,
} from '@/modules/jwt/jwt.interfaces';
import { CueCardsError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/cuecards-error.registry';
import { v4 } from 'uuid';

@Injectable()
export class JwtService {
  private readonly logger = new Logger(JwtService.name);

  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConf: ConfigType<typeof jwtConfig>,
    @Inject(appConfig.KEY)
    private appConf: ConfigType<typeof appConfig>,
  ) {}

  public async generateToken(args: IGenerateTokenArgs): Promise<string> {
    const { userId, version, tokenType, domain, tokenId } = args;
    const customFields: ICustomFields = {
      version,
    };
    const secret = this.jwtConf.privateKey;
    const options: jwt.SignOptions = {
      issuer: this.appConf.id,
      subject: userId,
      audience: domain ?? this.appConf.domain,
      expiresIn: this.jwtConf[tokenType].time,
      algorithm: 'RS256',
      jwtid: tokenId ?? v4(),
    };

    return JwtService.signJwt({ customFields, secret, options });
  }

  public async verifyToken(token: string, tokenType: TokenTypeEnum): Promise<CustomJwtPayload> {
    const secret = this.jwtConf.publicKey;
    const options: jwt.VerifyOptions = {
      issuer: this.appConf.id,
      audience: new RegExp(this.appConf.domain!),
      maxAge: this.jwtConf[tokenType].time,
      algorithms: ['RS256'],
    };

    return JwtService.verifyJwt({ token, secret, options }).catch((err) => {
      if (err instanceof jwt.TokenExpiredError) {
        throw new CueCardsError(CCBK_ERROR_CODES.UNAUTHORIZED, 'Token expired');
      }
      if (err instanceof jwt.JsonWebTokenError) {
        throw new CueCardsError(CCBK_ERROR_CODES.UNAUTHORIZED, 'Invalid token');
      }
      throw err;
    });
  }

  public async decodeJwt(token: string): Promise<CustomJwtPayload> {
    const jwtPayload = jwt.decode(token);

    if (typeof jwtPayload === 'string' || jwtPayload === null) {
      throw new CueCardsError(CCBK_ERROR_CODES.UNAUTHORIZED, 'Invalid token');
    }

    return jwtPayload as CustomJwtPayload;
  }

  private static async signJwt(args: IGenerateTokenAsyncArgs): Promise<string> {
    const { customFields, secret, options } = args;

    return new Promise((resolve, reject) => {
      jwt.sign(customFields, secret, options, (error, token) => {
        if (error) {
          reject(error);

          return;
        }

        if (token) {
          resolve(token);
        } else {
          reject(new Error('The token could not be generated'));
        }
      });
    });
  }

  private static async verifyJwt(args: IVerifyTokenArgs): Promise<CustomJwtPayload> {
    const { token, secret, options } = args;

    return new Promise((resolve, rejects) => {
      jwt.verify(token, secret, options, (error, payload: CustomJwtPayload) => {
        if (error) {
          rejects(error);

          return;
        }
        resolve(payload);
      });
    });
  }
}
