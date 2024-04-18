import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginDto } from 'modules/admin/common/dto/login.dto';
import { AppResponse } from 'common/types/response.type';

@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): AppResponse<string> {
    return this.adminService.login(loginDto);
  }

  // @UseGuards(AdminGuard)
  // @Get('check')
  // async check() {
  //   await Admin.create({
  //     email: 'armrisch123@gmail.com',
  //     firstName: 'admin',
  //     lastName: 'admin',
  //     role: AdminRoleEnum.admin,
  //     password: '456645',
  //   });
  //
  //   throw new Error('Testing global transaction');
  //
  //   return generateResponse('', 'test');
  // }
}
