import request from "@/service";
import { IDataType } from "@/service/types";
import store from "@/store";

import {
  IQuerySaveBodyPart,
} from "./types";

export enum CommonApi {
  queryCurUser = "/pis/common/queryCurUser",

}
export const saveDictionary = (params: IQuerySaveBodyPart) => {
  return request.post<IDataType>({ url: CommonApi.queryCurUser, data: params });
};


