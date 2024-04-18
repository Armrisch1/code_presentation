export interface ResponseInterface<T> {
  message: string;
  resData: Array<T>;
  status: number;
  success: boolean;
}
