
import Request from "./request";
import { TIME_OUT } from "./request/config";
import qs from "qs";
const request = new Request({
  baseURL: "/",
  timeout: TIME_OUT,
  interceptors: {
    requestInterceptor: config => {
      // console.log("new Request 传入的 拦截", config.headers);
      if (config?.data?.type) {
        if (config.data.type == "formdata") {
          delete config.data.type;
          config.data = qs.stringify(config.data);
        }
      }
      console.log(config, "config--------");
      return config;
    },
    requestInterceptorCatch: err => {
      return err;
    },
    responseInterceptor: res => {
      // debugger;
      // console.log("单个的实例 响应拦截 成功");
      if (res.data.code === "200") {
        res.data.code = 200;
      }
      console.log(res, "res----");
      return res;
    },
    responseInterceptorCatch: err => {
      return err;
    },
  },
});

export default request;
