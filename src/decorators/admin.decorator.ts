import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AdminDecorator = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request?.admin;
  },
);
