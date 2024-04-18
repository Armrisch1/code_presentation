import { ImageFolderEnum } from 'modules/file/enums/image-folder.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class FolderDto {
  @IsNotEmpty()
  @IsEnum(ImageFolderEnum)
  folder: ImageFolderEnum;
}
