import store from "@/store";
import moment from "moment";
import { hisPrintService } from "@/service/api/common";
import { emitter } from "@/utils/event-bus";
import type { PrintHandleType } from "@/components/print-button";
import type { IObject } from "@/utils/global-type";

/**
 * 打印
 * @param type  7 8 9   打印 | 预览 | 设置
 * @param printFormat 当前打印格式
 * @param printParams 打印参数
 */
const usePrint = (type: PrintHandleType, printFormat: IObject, printParams: IObject, print?: any) => {
  const userInfo = store.getters["user/userInfo"];
  const params: IObject = {
    cmdid: type, // 打印  预览  设置
    reportid: printFormat.reportid,
    formatid: printFormat.id,
    formatname: printFormat.name,
    datamode: 1,
    param: {
      ...printParams,
    }, // 打印参数
    UserInfo: {
      ID: userInfo?.userId,
    },
    btnprint: 1,
    datas: [],
  };
  if (print) {
    params["print"] = print;
  }
  const paramsString = JSON.stringify(params);
  const httpPathMap = store.getters["httpPath/pathMap"];

  const loginName = userInfo?.loginName;
  const trueName = userInfo?.trueName;

  window.crmmemberUrl = httpPathMap?.memberUrl + "/cloud";
  window.moment = moment;
  window.crmmember = httpPathMap.memberUrl + "/";
  window.SESSION = {
    trueName: trueName,
    userId: userInfo?.userId,
    loginName: loginName,
    jsessionids: userInfo?.jsessionids,
  };
  window.URLS = {
    hoinsurance: httpPathMap.hoinsurance,
    newhoinsurance: httpPathMap.newhoinsurance,
  };
  const printValue = store.getters.printValue;
  if (printValue !== "0") {
    // 新版
    window.insuarnceMdodal
      .configModule({
        type: "fastReport",
        data: paramsString, // data 传参 : 老版本fastReport打印传参的数据 原封不动赋给data；
      })
      .init(loginName, trueName)
      .then((res: any) => {
        console.log("打印结果***********", res);
        if (res.returndata.result == "success" && res.returndata?.Message?.includes("打印执行")) {
          emitter.emit("print_success_id", printParams);
        }
      })
      .catch(() => {});
  } else {
    console.log("ajax jsonp 旧版");
    hisPrintService({ inputData: paramsString })
      .then(res => {
        console.log("打印结果***********", res);
        emitter.emit("print_success_id", printParams);
      })
      .catch(() => {});
  }
};

export default usePrint;
