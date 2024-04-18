import { Module } from '@nestjs/common';
import { PropertyAdminController } from 'modules/admin/property/property.admin.controller';
import { PropertyAdminService } from 'modules/admin/property/property.admin.service';
import { JwtService } from 'shared/jwt/jwt.service';

@Module({
  controllers: [PropertyAdminController],
  providers: [PropertyAdminService, JwtService],
})
export class PropertyAdminModule {}
