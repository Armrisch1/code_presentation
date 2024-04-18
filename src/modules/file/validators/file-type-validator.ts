import { ALLOWED_IMG_MIMETYPES } from 'constants/config';
import { FileValidator } from '@nestjs/common';

interface FileTypeValidationOptions {
  allowedTypes?: string[];
}

export class FileTypeValidator extends FileValidator<FileTypeValidationOptions> {
  constructor(
    validationOptions: FileTypeValidationOptions = {
      allowedTypes: ALLOWED_IMG_MIMETYPES,
    },
  ) {
    super(validationOptions);
  }

  isValid(file: any): boolean | Promise<boolean> {
    return this.validationOptions.allowedTypes.includes(file.mimetype);
  }

  buildErrorMessage(file: any): string {
    return `Invalid file type ${file.mimetype}. Allowed types are: ${this.validationOptions.allowedTypes}`;
  }
}
