import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { NestApplication } from '@nestjs/core';

export default class Swagger {
  document: OpenAPIObject;
  app: NestApplication;
  constructor(app) {
    this.app = app;
    const options = new DocumentBuilder()
      .setTitle('Hayerenik Api')
      .setDescription('Hayerenik children shop project api')
      .setVersion('0.0.1')
      .addBearerAuth()
      .build();
    this.document = SwaggerModule.createDocument(app, options);
  }
  setup() {
    return SwaggerModule.setup('swagger', this.app, this.document);
  }
}
