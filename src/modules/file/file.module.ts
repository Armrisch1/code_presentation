import { Module } from '@nestjs/common';
import { FileController } from 'modules/file/file.controller';
import { FileService } from 'modules/file/file.service';
import { JwtService } from 'shared/jwt/jwt.service';

@Module({
   controllers: [FileController],
   providers: [FileService, JwtService],
})
export class FileModule {}
