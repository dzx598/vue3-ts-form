
/**
 * 定义 接口返回的类型。里面有code、data
 * 且data 不是固定的类型，可能返回返回的data是对象  也有可能是数组 或者其他类型，所以这里不能写死
 */
export interface IDataType<T = any> {
  code: number | string;
  data?: T;
  list?: any[];
  map?: any;
  result?: string;
  resultMsg?: string;
  total?: string | number;
  totalPage?: string | number;
  resultObj?: any;
  obj: any; // 获取打印格式接口 printOriginalFormat
}
