
// service统一出口
import Request from "./request";
import { BASE_URL, TIME_OUT } from "./request/config";

const request = new Request({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestInterceptor: config => {
      // console.log("new Request 传入的 拦截", config.headers);
      return config;
    },
    requestInterceptorCatch: err => {
      return err;
    },
    responseInterceptor: res => {
      // console.log("单个的实例 响应拦截 成功");
      return res;
    },
    responseInterceptorCatch: err => {
      return err;
    },
  },
});

export default request;
