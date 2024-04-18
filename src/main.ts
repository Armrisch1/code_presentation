import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import Swagger from './utils/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { PORT, ORIGINS } from 'constants/config';

const bootstrap = async () => NestFactory.create(AppModule);

const startApp = async (app) => {
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors({
    credentials: true,
    origin: ORIGINS,
  });

  app.use(cookieParser());

  const swagger = new Swagger(app);
  swagger.setup();

  await app.listen(PORT);

  return `Application is running on port ${PORT}`;
};

bootstrap().then(startApp).then(console.log).catch(console.error);
