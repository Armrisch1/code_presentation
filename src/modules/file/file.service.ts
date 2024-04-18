import { BadRequestException, Injectable } from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import { join, resolve } from 'path';
import { UPLOAD_FOLDER_PATH } from 'constants/config';
import { ImageInterface } from 'modules/file/interfaces/image.interface';
import { AppResponse } from 'common/types/response.type';
import { generateResponse } from 'utils/helpers';
import { ImageFolderEnum } from 'modules/file/enums/image-folder.enum';
import { FileService as FileHelper } from 'shared/file/file.service';

@Injectable()
export class FileService {
  constructor(private readonly fileHelper: FileHelper) {}

  async uploadMultipleImages(
    images: Array<Express.Multer.File>,
    folder: ImageFolderEnum,
  ): AppResponse<ImageInterface[]> {
    const uploadedImages = await Promise.all(images.map((image: Express.Multer.File) => this.saveImage(image, folder)));

    return generateResponse(uploadedImages, 'Multiple files uploaded successfully', 201);
  }

  async uploadImage(image: Express.Multer.File, folder: ImageFolderEnum): AppResponse<ImageInterface> {
    const imageData = await this.saveImage(image, folder);
    return generateResponse(imageData, 'Image uploaded successfully', 201);
  }

  async saveImage(image: Express.Multer.File, folder: ImageFolderEnum): Promise<ImageInterface> {
    try {
      const uploadPath = resolve(UPLOAD_FOLDER_PATH, folder);

      // create folder if none exists
      await fsPromises.mkdir(uploadPath, { recursive: true });

      const uniqueFilename = Date.now() + '-' + image.originalname.replace(/\s/g, '');
      const imagePath = join(uploadPath, uniqueFilename);

      // save file
      await fsPromises.writeFile(imagePath, image.buffer);

      return {
        src: `${folder}/${uniqueFilename}`,
      };
    } catch (error) {
      console.error('Error saving image:', error, error.message);

      throw new Error('Failed to save image');
    }
  }

  async deleteImage(imageSrc: string): AppResponse<string> {
    const fullPath = `${UPLOAD_FOLDER_PATH}/${imageSrc}`;

    if (!(await this.fileHelper.fileExists(fullPath))) {
      throw new BadRequestException('Provided path is not correct');
    }

    await this.fileHelper.deleteFile(fullPath);

    return generateResponse(imageSrc, 'image successfully deleted', 202);
  }
}
