import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from 'shared/jwt/jwt.service';
import { TokenTypeEnum } from 'common/enums/token-type.enum';
import { JwtDataInterface } from 'common/interfaces/jwt-data.interface';
import { Admin } from 'models/admin';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const accessToken = request.headers?.authorization?.split(' ')?.[1];

      if (!accessToken) {
        throw new UnauthorizedException('Unauthorized');
      }

      const decodedAccessToken: JwtDataInterface = await this.jwtService.verify(
        accessToken,
        TokenTypeEnum.access,
      );

      const admin = await Admin.findByPk(decodedAccessToken.adminId);

      if (!admin) {
        throw new UnauthorizedException('Unauthorized');
      }

      request.admin = {
        id: admin.id,
        email: admin.email,
      };

      return true;
    } catch (error) {
      console.log('Auth failed - ', error.message);
      throw new ForbiddenException(error.message);
    }
  }
}
