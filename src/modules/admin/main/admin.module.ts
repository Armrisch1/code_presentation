import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtService } from 'shared/jwt/jwt.service';

@Module({
  imports: [],
  providers: [AdminService, JwtService],
  controllers: [AdminController],
})
export class AdminModule {}
