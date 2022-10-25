
// 2.根据process.env.NODE_ENV区分
// 开发环境: development
// 生成环境: production
// 测试环境: test
const BASE_URL = import.meta.env?.VITE_APP_API_PREFIX as string;
const TIME_OUT = 10000;

const PRO_URL = process.env.NODE_ENV === "development" ? "http://192.168.1.154:5050" : window.location.origin;
// console.log(import.meta.env?.VITE_APP_API_PREFIX, "VITE_APP_API_PREFIX=");

// if (process.env.NODE_ENV === "development") {
//   //   BASE_URL = "/api";
// } else if (process.env.NODE_ENV === "production") {
//   //   BASE_URL = "http://192.168.1.154:5050";
// } else {
//   //   BASE_URL = "http://192.168.1.154:5050";
// }

export { BASE_URL, TIME_OUT, PRO_URL };
