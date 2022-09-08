// @ts-ignore
import RequestPool from 'x-request-pool';
import type {IFRequestConfig, EnumRequestMethod} from './config';

const insConfig = {
  baseUrl: String(import.meta.env.VITE_APP_HTTP_HOST) + String(import.meta.env.VITE_APP_HTTP_URL),
  timeout: 180000
};

export function httpRequest<T>(requestConfig: IFRequestConfig) {
  return new Promise<T>((resolve, reject) => {
    const RequestPoolIns = RequestPool.getRequestIns(insConfig);
    const useRequestConfig: any = requestConfig;
    RequestPool.doRequest(RequestPoolIns, useRequestConfig)
      .then((result: any) => {
        resolve(result.data);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}


export interface IFCancelPayload {
  method: EnumRequestMethod;
  url: string;
  params?: any;
}

export function cancelHttp(cancelPayload?: IFCancelPayload) {
  RequestPool.cancelRequest(cancelPayload);
}

export const useHTTP = (base: `${string}`) => {
  /**
   * P - 参数类型
   * R - 返回值类型
   * @param url
   * @constructor
   */
  const GET =
    <P, R>(url: `/${string}`) =>
    (params: P) =>
      httpRequest<R>({
        url: `${base}${url}`,
        method: 'GET',
        params: {
          ...params
        }
      });

  /**
   * P - 参数类型
   * R - 返回值类型
   * @param url
   * @constructor
   */
  const POST =
    <P, R>(url: `/${string}`) =>
    (params: P) =>
      httpRequest<R>({
        url: `${base}${url}`,
        method: 'POST',
        data: {
          ...params
        }
      });

  return { GET, POST };
};
