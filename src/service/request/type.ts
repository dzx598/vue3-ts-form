import type { AxiosRequestConfig, AxiosResponse } from "axios";

export interface IRequestInterceptors<T = AxiosResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorCatch?: (error: any) => any;
  responseInterceptor?: (res: T) => T;
  responseInterceptorCatch?: (error: any) => any;
}

export interface IRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: IRequestInterceptors<T>;
  showLoading?: boolean;
  type?: string;
}
