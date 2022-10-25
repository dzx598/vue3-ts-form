/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent,ComponentOptions  } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  const componentOptions: ComponentOptions
  export default component;
  export default componentOptions
}

declare module "*.js";

declare interface Window {
  $message: any; // naive ui 的 message
  $dialog: any;
  message: any;
  $loading: any;
  cloudOpenWindow: (payload?: boolean) => {};
  layer: any;
  $refreshTable: (payload?: boolean) => {};
}

declare interface Navigator {
  getUserMedia: any;
  webkitGetUserMedia: any;
  mozGetUserMedia: any;
  // myCode: undefined;
  // appCodeName: () => {};
}

// ===> commonweb 下定义的一些全局变量
declare interface Window {
  funSettingData: any;
  crmmemberUrl: any;
  crmmember: any;
  SESSION: any;
  URLS: any;
  insuarnceMdodal: any;
  memberUrl: any;
  jsessionids: any;
  memberMdodal: any;
  $: any;
}
