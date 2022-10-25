export type IFormType =
  | "number"
  | "input"
  | "radio"
  | "select"
  | "datetime"
  | "date"
  | "radio-input"
  | "time"
  | "textarea"
  | "checkbox"
  | "img"
  | "checkboxTree"
  | "selectTree"
  | "select-multiple"
  | "select-repeat"
  | "selectRef"
  | "uploadImg";

export interface IOptionLabelValue {
  label?: string;
  value?: string;
  attr1?: string; //拼音
  attr2?: string; //五笔
}

export interface IOtherField {
  field: string;
  type: IFormType; // 与IFormItem 中的type保持一直
  fieldOptionValue: string; // 需要取列表(select等)中的哪个字段的值 保存到 field字段中
}

export interface IEvent {
  input?: () => void;
}
// {
//   label: "输入框",
//   fileId: "input",
//   onFocus: false,
//   type: "input",
//   itemSpan: 6,
//   title: "ID:",
// }
export interface IFormItem {
  field: string;
  type: IFormType;
  label: string;
  title?: string;
  // rules?: any[];
  placeholder?: any;
  // 针对select
  options?: any[];
  // 针对特殊的属性  otherOptions 里面字段 会 一一 绑定在 n-input-number n-select  n-date-picker 组件中
  otherOptions?: any;
  radios?: any[];
  checkboxs?: any[];
  // isHidden?: boolean;
  isrule?: Boolean; // 是否校验这个字段
  itemSpan?: string | number; // 遵循 n-grid-item 组件中的 span 参数类型
  optionLabelValue?: IOptionLabelValue; // select radio 等等 选择项的 label 和 value
  suffix?: string; // 输入框 尾部内容
  otherField?: IOtherField; // 需要保存其他字段的配置.
  events?: IEvent; // 输入框的输入事件
  show?: boolean;
  selectUpdate?: (value: any) => void; //select框触发改变时候 回调该函数
  searchMethod?: (value: any, key?: any, item?: any) => any[]; //搜索时候 回调该函数
  selectList?: any; //多选框list
  fieldName?: any; //fielid
  disable?: boolean;
  require?: boolean;
  ref?: any; //ref
  selectOptions?: any[]; //tree select匹配
  pattern?: any; // tree筛选
  onFocus?: any; //点击
}

export interface IForm {
  formItems: IFormItem[];
  labelWidth?: string;
  xGap?: number;
  yGap?: number;
  cols?: number;
  itemStyle?: any;
}

export type LabelPlacementType = "left" | "top";

// import { IFormType } from "@/components/basic-form";
export type VerifyType = "number" | "array" | "string";

export interface IFormItemTypeMapValue {
  name: String;
  type: IFormType;
  defaultValue: any;
  trigger?: string[]; // 表单校验时 触发方式
  options?: Boolean;
  radios?: Boolean;
  checkboxs?: Boolean;
  otherOptions?: any;
  verifyType?: VerifyType; // 使用form.validate 校验。 指定表单校验回填值的类型
}

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
export type IFormItemTypeMap = {
  [key in FormItemTypeMapKey]: IFormItemTypeMapValue;
};

// interface IObj {
//   [key: string]: string;
// }
// const obj: IObj = { "19020": "1", "19030": "19030" };
