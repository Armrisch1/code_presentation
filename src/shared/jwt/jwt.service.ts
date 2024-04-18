import {
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_SECRET,
} from 'constants/config';
import { JwtService as Jwt } from '@nestjs/jwt';
import { TokenTypeEnum } from 'common/enums/token-type.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtService {
  private jwtAccessTokenInstance: Jwt;
  private jwtRefreshTokenInstance: Jwt;

  constructor() {
    this.jwtAccessTokenInstance = new Jwt({
      secret: JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME },
    });
    this.jwtRefreshTokenInstance = new Jwt({
      secret: JWT_REFRESH_TOKEN_SECRET,
      signOptions: { expiresIn: JWT_REFRESH_TOKEN_EXPIRATION_TIME },
    });
  }

  sign(payload: any, type: TokenTypeEnum): string {
    let token: string;

    if (type === TokenTypeEnum.access) {
      token = this.jwtAccessTokenInstance.sign(payload);
    } else {
      token = this.jwtRefreshTokenInstance.sign(payload);
    }

    return token;
  }

  verify(token: string, type: TokenTypeEnum): any {
    let result;

    if (type === TokenTypeEnum.access) {
      result = this.jwtAccessTokenInstance.verify(token);
    } else {
      result = this.jwtRefreshTokenInstance.verify(token);
    }

    return result;
  }

  decode(token: string, type: TokenTypeEnum): any {
    let data;

    if (type === TokenTypeEnum.access) {
      data = this.jwtAccessTokenInstance.decode(token);
    } else {
      data = this.jwtRefreshTokenInstance.decode(token);
    }

    return data;
  }
}
