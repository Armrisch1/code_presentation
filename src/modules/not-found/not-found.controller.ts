import { Controller, Get, NotFoundException, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { NOT_FOUND_PAGE_PATH } from 'constants/config';

@Controller()
export class NotFoundController {
  @Get('api*')
  apiNotFound() {
    throw new NotFoundException('Page Not Found');
  }

  @Get('*')
  notFound(@Req() request: Request, @Res() response: Response) {
    return response.sendFile(NOT_FOUND_PAGE_PATH);
  }
}
