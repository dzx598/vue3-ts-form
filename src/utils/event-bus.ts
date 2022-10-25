import mitt, { Emitter } from "mitt";
import type { IObject } from "@/utils/global-type";
type EventType = {
  report_submit: any; // 报告书写/提交
  advice_submit: any; // 技术医嘱保存
  report_submit_state: IObject | Boolean; // 报告书写/提交之后 成功还是失败状态
  material_add: number; // 添加取材
  print_success_id: any;
  publish_from_disabled: boolean;
};

export const emitter: Emitter<EventType> = mitt<EventType>();
