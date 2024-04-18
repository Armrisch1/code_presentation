import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { LoginDto } from 'modules/admin/common/dto/login.dto';
import { generateResponse } from 'utils/helpers';
import { JwtService } from 'shared/jwt/jwt.service';
import { Admin } from 'models/admin';
import { TokenTypeEnum } from 'common/enums/token-type.enum';
import { AppResponse } from 'common/types/response.type';

@Injectable()
export class AdminService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto): AppResponse<string> {
    const admin = await Admin.findOne({ where: { email: loginDto.email } });

    if (!admin || !(await bcrypt.compare(loginDto.password, admin?.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.jwtService.sign(
      {
        adminId: admin.id,
        randomHash: crypto.randomBytes(2).toString('hex'),
      },
      TokenTypeEnum.access,
    );

    return generateResponse(accessToken, 'successfully logged in', 201);
  }
}
