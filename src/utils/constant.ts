import { IFormType } from "@/components/basic-form";
// 字典查询
const catalogIdMap = {
  "110": "标本类型",
  "470": "系统参数",
  "140": "部位",
  "120": "送检渠道",
  "100": "固定液类型",
};

export interface IFormItemTypeMapValue {
  name: String;
  type: IFormType;
  value: any;
  options?: any[];
  radios?: any[];
  checkboxs?: any[];
  otherOptions?: any;
}
export interface IFormItemTypeMap {
  19010: IFormItemTypeMapValue;
  19020: IFormItemTypeMapValue;
  19030: IFormItemTypeMapValue;
  19040: IFormItemTypeMapValue;
  19050: IFormItemTypeMapValue;
  19060: IFormItemTypeMapValue;
  19070: IFormItemTypeMapValue;
  19080: IFormItemTypeMapValue;
  19090: IFormItemTypeMapValue;
  19100: IFormItemTypeMapValue;
  19110: IFormItemTypeMapValue;
}

/**
 * 表单类型 映射表
 */
export const formItemTypeMap: IFormItemTypeMap = {
  "19010": {
    name: "数字",
    type: "number",
    value: null,
  },
  "19020": {
    name: "文本",
    type: "input",
    value: null,
  },
  "19030": {
    name: "下拉框",
    type: "select", // n-select
    options: [],
    value: null,
  },
  "19040": {
    name: "日期时间",
    type: "datetime", // n-date-picker type=datetime
    value: null,
  },
  "19050": {
    name: "日期",
    type: "date", // n-date-picker  type=date
    value: null,
  },
  "19060": {
    name: "时间",
    type: "time", // n-time-picker
    value: null,
  },
  "19070": {
    name: "多行文本",
    type: "textarea",
    value: null,
  },
  "19080": {
    name: "多选框",
    type: "checkbox",
    checkboxs: [],
    value: null,
  },
  "19090": {
    name: "单选框",
    type: "radio",
    radios: [],
    value: null,
  },
  "19100": {
    name: "下拉多选",
    type: "select-multiple", // n-select
    options: [],
    value: null,
  },
  "19110": {
    name: "下拉框(不可输入)",
    type: "select", // n-select
    options: [],
    value: null,
  },
};

export type FormItemTypeMapKey =
  | "19010"
  | "19020"
  | "19030"
  | "19040"
  | "19050"
  | "19060"
  | "19070"
  | "19080"
  | "19090"
  | "19100"
  | "19110";
