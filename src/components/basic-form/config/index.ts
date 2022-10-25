import { IFormItemTypeMap } from "../types";
/**
 * 表单类型 映射表
 */
export const formItemTypeMapObj: IFormItemTypeMap = {
  "19010": {
    name: "数字",
    type: "number",
    defaultValue: null,
    trigger: ["input", "change"],
    verifyType: "number",
  },
  "19020": {
    name: "文本",
    type: "input",
    defaultValue: null,
    trigger: ["input", "change"],
  },
  "19030": {
    name: "下拉框",
    type: "select", // n-select
    options: true,
    defaultValue: null,
    trigger: ["blur", "change"],
    // verifyType: ["number", "string"], // 有的下拉框数据id是 字符串。但是数据回显的id 后端又是返回 数字类型。所以这里设置校验类型number，string
  },
  "19040": {
    name: "日期时间",
    type: "datetime", // n-date-picker type=datetime
    defaultValue: null,
    trigger: ["blur", "change"],
  },
  "19050": {
    name: "日期",
    type: "date", // n-date-picker  type=date
    defaultValue: null,
    trigger: ["blur", "change"],
  },
  "19060": {
    name: "时间",
    type: "time", // n-time-picker
    defaultValue: null,
    trigger: ["blur", "change"],
  },
  "19070": {
    name: "多行文本",
    type: "textarea",
    defaultValue: null,
    trigger: ["input", "change"],
  },
  "19080": {
    name: "多选框",
    type: "checkbox",
    checkboxs: true,
    defaultValue: null,
    trigger: ["blur", "change"],
  },
  "19090": {
    name: "单选框",
    type: "radio",
    radios: true,
    defaultValue: null,
    trigger: ["blur", "change"],
    // verifyType: ["number", "string"],
  },
  "19100": {
    name: "下拉多选",
    type: "select-multiple", // n-select
    options: true,
    defaultValue: null,
    trigger: ["blur", "change"],
    verifyType: "array",
  },
  "19110": {
    name: "下拉框(不可输入)",
    type: "select", // n-select
    options: true,

    defaultValue: null,
    trigger: ["blur", "change"],
  },
};
