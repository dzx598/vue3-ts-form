import axios from "axios";
import store from "@/store";
import qs from "qs";
import type { AxiosInstance } from "axios";
import type { IRequestInterceptors, IRequestConfig } from "./type";
import type { IDataType } from "../types";
import { getParentCookie } from "@/utils/tool";
const DEAFULT_LOADING = false; // 是否加载 loading。默认false 不加载

class Request {
  instance: AxiosInstance;
  interceptors?: IRequestInterceptors;
  showLoading: boolean;
  // loading?: ILoadingInstance;

  constructor(config: IRequestConfig) {
    // 创建axios实例
    this.instance = axios.create(config);

    // 保存基本信息
    this.showLoading = config.showLoading ?? DEAFULT_LOADING;
    this.interceptors = config.interceptors;

    // 使用拦截器
    // 1.从config中取出的拦截器是对应的实例的拦截器
    this.instance.interceptors.request.use(this.interceptors?.requestInterceptor, this.interceptors?.requestInterceptorCatch);
    this.instance.interceptors.response.use(this.interceptors?.responseInterceptor, this.interceptors?.responseInterceptorCatch);

    // 2.添加所有的实例都有的拦截器
    this.instance.interceptors.request.use(
      config => {
        // if (this.showLoading) {
        //    // 加载loading
        // }
        return config;
      },
      err => {
        return err;
      }
    );

    this.instance.interceptors.response.use(
      res => {
        // console.log("添加所有的实例 响应拦截 成功");
        // 将loading移除
        // this.loading?.close();
        //  console.log(res, "----");
        const data = res.data;
        // return data;

        const { code, resultMsg } = data;
        switch (code) {
          case 200:
            return data;
            break;
          default:
            //全局弹出错误信息
            window.$message.error(resultMsg);
            // console.log("请求失败~, 错误信息", resultMsg);
            // return data;
            //===>>> 使用 throw 抛出错误 进入到 实例的 request请求 的catch 回调。是那里面 reject(err)
            throw resultMsg;
            break;
        }
      },
      err => {
        // http 请求报错
        // 将loading移除
        if (this.showLoading) {

          //store.loading = false
        }
        this.showLoading = DEAFULT_LOADING;

        // 例子: 判断不同的HttpErrorCode显示不同的错误信息
        // if (err.response.status === 404) {
        //   console.log("404的错误~");
        // }
        return err;
      }
    );
  }

  request<T>(config: IRequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // console.log("单个 request 请求中的 拦截");
      // 1.单个请求对请求config的处理
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config);
      }

      // 2.判断是否需要显示loading
      if (config.showLoading === true) {
        this.showLoading = config.showLoading;
        // 显示加载层
        //store.commit("changeGlobalLoading", true);
      }

      this.instance
        .request<any, T>(config)
        .then(res => {
          //===>>> 这里接收的是 上面所有响应拦截成功 return data;中 data数据
          // console.log("instance 实例的then", res);
          // 1.单个请求对数据的处理
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res);
          }
          // 2.将showLoading设置 默认值, 这样不会影响下一个请求
          this.showLoading = DEAFULT_LOADING;
          // 关闭全局loading
         // store.state.loading = false

          // 3.将结果resolve返回出去
          // const { code, resultMsg } = res;
          // switch (code) {
          //   case 200:
          //     // return data;
          //     resolve(res);
          //     break;

          //   default:
          //     //全局弹出错误信息
          //     console.log("请求失败~, 错误信息", resultMsg);
          //     reject(res);
          //     break;
          // }
          resolve(res);
        })
        .catch(err => {
          // console.log("响应错误-===", err);
          // 将showLoading设置false, 这样不会影响下一个请求
          this.showLoading = DEAFULT_LOADING;
          // 关闭全局loading
          //store.loading = false
          reject(err);
          return err;
        });
    });
  }

  get<T = IDataType>(config: IRequestConfig<T>): Promise<T> {
    const jsessionids = getParentCookie("jsessionids");
    if (config.data) {
      config.data["jsessionids"] = jsessionids;
    }
    config.params["jsessionids"] = jsessionids;
    return this.request<T>({ ...config, method: "GET" });
  }

  post<T = IDataType>(config: IRequestConfig<T>): Promise<T> {
    // console.log("post请求", config);
    //添加  jsessionids
    const jsessionids = getParentCookie("jsessionids");
    if (config.data) {
      config.data["jsessionids"] = jsessionids;
    }
    return this.request<T>({ ...config, method: "POST" });
  }

  delete<T = any>(config: IRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: "DELETE" });
  }

  patch<T = any>(config: IRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: "PATCH" });
  }
}

export default Request;
