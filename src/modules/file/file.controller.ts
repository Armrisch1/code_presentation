import {
  Body,
  Controller,
  Delete,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { FileService } from 'modules/file/file.service';
import { FileTypeValidator } from 'modules/file/validators/file-type-validator';
import { FolderDto } from 'modules/file/dto/folder.dto';
import { MAX_FILE_SIZE } from 'constants/config';
import { AdminGuard } from 'guards/admin.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ImageFolderEnum } from 'modules/file/enums/image-folder.enum';

const parseFilePipe = new ParseFilePipe({
  validators: [new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }), new FileTypeValidator()],
});

@Controller('api/file')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload-images')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        folder: {
          type: 'enum',
          enum: Object.values(ImageFolderEnum),
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images'))
  async uploadMultipleImages(
    @Body() folderDto: FolderDto,
    @UploadedFiles(parseFilePipe) images: Array<Express.Multer.File>,
  ) {
    return this.fileService.uploadMultipleImages(images, folderDto.folder);
  }

  @Post('upload-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        folder: {
          type: 'enum',
          enum: Object.values(ImageFolderEnum),
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@Body() folderDto: FolderDto, @UploadedFile(parseFilePipe) image: Express.Multer.File) {
    return this.fileService.uploadImage(image, folderDto.folder);
  }

  @Delete()
  async deleteImage(@Body() data: { src: string }) {
    return this.fileService.deleteImage(data.src);
  }
}
