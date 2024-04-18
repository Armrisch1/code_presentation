import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class NotFoundMiddleware implements NestMiddleware {
  private static readonly excludedPaths = ['/api', '/images', '/assets'];

  use(req: Request, res: Response, next: NextFunction) {
    const pathToExclude = NotFoundMiddleware.excludedPaths.find((excludedPath: string) =>
      req.baseUrl.startsWith(excludedPath),
    );

    if (!pathToExclude) {
      throw new NotFoundException('404 not found');
    }

    next();
  }
}
