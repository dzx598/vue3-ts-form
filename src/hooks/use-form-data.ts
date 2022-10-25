import { SelectOption, SelectGroupOption, FormRules } from "naive-ui";
import { IFormItem, FormItemTypeMapKey, IOptionLabelValue } from "@/components/basic-form";
import { formItemTypeMapObj } from "@/components/basic-form/config";

import moment from "moment";
interface IFormatForm {
  formList: IFormItem[];
  formValue: any;
  requiredFields: any;
  formRules: FormRules;
}
const maps = new Map();

maps.set("queryDepartment", 1);
maps.set("queryAllUser", 2);
/**
 *
 * @param datas 表单列表数据
 * @returns
 * formList [ {}, {} ]
 * formValue：保存每项的值  eg： { channel: "", personName: "", ...}
 * requiredFields 校验字段  格式：{ channel: "channel", personName: "personName",... }
 * FormRules 校验规则 格式保持Naive-UI 的一致 { channel: {required: true, tirgger: "input",type: "number"},  ... }
 */
export function useFormItemFormat(datas: any[]): IFormatForm {
  const formList: IFormItem[] = [];
  const formValue: any = {};
  const requiredFields: any = {};
  const formRules: FormRules = {};
  // 过滤不显示的表单项
  const newData = datas.filter(item => item.visible);
  console.log(newData, "-----------");

  newData.forEach((element: any) => {
    const { fieldLabel, fieldName, selectLabel, selectValue, required, methodChange, canEdit } = element;
    const fieldType: FormItemTypeMapKey = element.fieldType;
    const formItem: IFormItem = {
      field: fieldName,
      label: fieldLabel,
      type: "input",
      isrule: required ?? false,
      disable: !canEdit,
    };
    // 表单类型的 初始值
    const typeMapValue = formItemTypeMapObj[fieldType];

    // 1. 收集保存表单数据字段
    if (typeMapValue) {
      formValue[fieldName] = typeMapValue.defaultValue;
    }

    // 2. 收集校验字段
    // if (element.required) {
    //   requiredFields[element.fieldName] = element.fieldName;
    // }

    if (typeMapValue) {
      // 3. 表单项
      formItem.type = typeMapValue.type;

      //下拉多选(select-multiple) 需要 添加 multiple
      if (formItem.type == "select-multiple") {
        formItem["otherOptions"] = { multiple: true };
      }
      //给number输入框设置默认属性
      if (formItem.type == "number") {
        if (Object.prototype.hasOwnProperty.call(formItem, "otherOptions")) {
          formItem.otherOptions["showButton"] = false;
        } else {
          formItem.otherOptions = { showButton: false };
        }
      }
      if (typeMapValue.options) {
        // select  不能将 typeMapValue.options 赋值给 formItem.options
        formItem.options = [];

        //formItem.otherOptions["filter"] = selectFilter;
        if (maps.has(methodChange)) {
          console.log(methodChange);
          formItem.searchMethod = maps.get(methodChange);
        }

        if (Object.prototype.hasOwnProperty.call(formItem, "otherOptions")) {
          formItem.otherOptions["filterable"] = true;
          //给select加上自己的过滤器
          formItem.otherOptions["filter"] = selectFilter;

          // console.log(methodChange);
        } else {
          formItem.otherOptions = { filterable: true };
          if (!formItem.searchMethod) {
            formItem.otherOptions["filterable"] = true;
            formItem.otherOptions["filter"] = selectFilter;
          } else {
            formItem.otherOptions["remote"] = true;
            formItem.otherOptions["filter"] = (pattern: string, option: any) => {
              return option;
            };
          }
        }
        //设置下拉框不能输入
        if (fieldType == "19110") {
          formItem.otherOptions["filterable"] = false;
        }
      } else if (typeMapValue.radios) {
        // radio
        formItem.radios = [];
      } else if (typeMapValue.checkboxs) {
        // checkbox
        formItem.checkboxs = [];
      }
      if (typeMapValue.otherOptions) {
        formItem.otherOptions = typeMapValue.otherOptions;
      }

      // 4. 收集校验规则
      if (element.required) {
        formRules[element.fieldName] = {
          required: true,
          message: `${fieldLabel} 不能为空`,
          trigger: typeMapValue.trigger ? [...typeMapValue.trigger] : [],
          type: typeMapValue.verifyType ?? "string",
        };
      }
    }

    if (selectLabel && selectValue) {
      formItem.optionLabelValue = { label: selectLabel, value: selectValue };
    }

    formList.push(formItem);
  });

  return {
    formList,
    formValue,
    requiredFields,
    formRules,
  };
}

/**
 *
 * @param originValue
 * @param option
 * @returns 返回 select 下拉框 options 对应字段数据
 */
export function useSetFormOptions(originValue: any[], option: IOptionLabelValue): IOptionLabelValue[] {
  const options: IOptionLabelValue[] = [];
  //console.log(originValue, option);
  originValue.forEach(ele => {
    const value: any = option.value; //回显的value字段
    const label: any = option.label; //显示的label字段

    const newOption = { ...option };
    //插入拼音字段
    if (ele?.attr1) {
      newOption.attr1 = ele?.attr1;
    }
    //插入五笔字段
    if (ele?.attr2) {
      newOption.attr2 = ele?.attr2;
    }
    if (ele[value]) {
      newOption.value = ele[value];
    }
    if (ele[label]) {
      newOption.label = ele[label];
    }
    options.push(newOption);
  });
  return options;
}

/**
 * 自定义重置表单校验规则
 * @param originRules 原始表单规则
 * @param targetRules 目标字段规则
 */
export function useFormRules(originRules: FormRules, targetRules: FormRules) {
  //console.log(originRules, targetRules, "--------");

  for (const key in targetRules) {
    const element = targetRules[key];
    originRules[key] = { ...originRules[key], ...element };
  }
}

/**
 * 将日期时间(xxxx-xx-xx xx:xx:xx) 格式 转成 日期 格式(xxxx-xx-xx)。
 * @param value
 * @returns
 */
export function useDate(value: string) {
  if (!value) {
    return null;
  } else {
    return value.split(" ")[0];
  }
}

/**
 * 数据和表单项目配置格式化一致,
 * 比如：表单项 是 date 日期项 入库时 存入 yyyy-mm-dd，获取详情的时 接口有返回了 yyyy-mm-dd hh:mm:ss(本应该后端处理 不应该返回时间,入库什么格式就返回什么格式,后端处理不了只能前端处理了)
 * 提交数据时候只能 提交 yyyy-mm-dd 格式 否则会报错, 所以 需要根据 表单项 把后端数据在格式化一下
 * @param value 原始数据
 * @param formItem 表单项
 * @returns
 */
export function useFormatValue(value: any, formItem: IFormItem[]) {
  const target: any = { ...value };
  formItem.forEach(item => {
    if (item.type === "date") {
      const fieldValue = value[item.field];
      target[item.field] = useDate(fieldValue);
    }

    if (item.type == "datetime" && target[item.field]) {
      target[item.field] = moment(target[item.field]).format("yyyy-MM-DD HH:mm:ss");
    }
  });

  return target;
}

export function useFormRequiredField(datas: any[]) {
  // 过滤不显示的表单项
  const newData = datas.filter(item => item.visible);
  const fieldList: string[] = [];
  const requiredFormList: any[] = [];
  newData.forEach(item => {
    const { fieldName, required } = item;
    if (required) {
      fieldList.push(fieldName);
      requiredFormList.push(item);
    }
  });
  return { fieldList, requiredFormList };
}

export function selectFilter(pattern: string, option: any) {
  for (const key in option) {
    if (option[key]) {
      if (option[key]?.toString()?.includes(pattern)) {
        return option;
      }
    }
  }
  //  return option;
}
