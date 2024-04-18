import { ResponseInterface } from 'common/interfaces/response.interface';

export type AppResponse<T> = Promise<ResponseInterface<T>>;
