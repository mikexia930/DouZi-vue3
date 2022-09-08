export interface IFRequestConfig {
  contentType?: string;
  url: string;
  method: string;
  headers?: any;
  params?: any;
  data?: any;
}

export enum EnumRequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}