import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileService {
  async readFile(filePath: string): Promise<string> {
    return fs.promises.readFile(filePath, 'utf-8');
  }

  async writeFile(filePath: string, data: string): Promise<void> {
    return fs.promises.writeFile(filePath, data, 'utf-8');
  }

  async deleteFile(filePath: string): Promise<void> {
    if (await this.fileExists(filePath)) {
      return fs.promises.unlink(filePath);
    }
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  async createDirectory(directoryPath: string): Promise<string | undefined> {
    return fs.promises.mkdir(directoryPath, { recursive: true });
  }

  async moveFile(sourcePath: string, destinationPath: string): Promise<void> {
    return fs.promises.rename(sourcePath, destinationPath);
  }
}
