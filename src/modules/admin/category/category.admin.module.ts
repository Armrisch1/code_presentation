import { Module } from '@nestjs/common';
import { CategoryAdminController } from 'modules/admin/category/category.admin.controller';
import { CategoryAdminService } from 'modules/admin/category/category.admin.service';
import { JwtService } from 'shared/jwt/jwt.service';
import { CategoryHelper } from 'common/helpers/category.helper';

@Module({
  controllers: [CategoryAdminController],
  providers: [CategoryAdminService, JwtService, CategoryHelper],
})
export class CategoryAdminModule {}
