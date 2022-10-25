const minute_s = 60; // 1 minute 60s
const hour_s = 60 * minute_s; // 1 hour 60*60s
const day_s = 24 * hour_s; // 1 day 24 * hour

/**
 * 获取 父级 Cookie中的数据
 * @param {String} key Cookie中的键
 * @returns
 */
export const getParentCookie = (key: string): string => {
  if (!key) return "";
  // const cookieStr = window?.parent?.document.cookie
  const cookieStr = window && window.parent && window.parent.document && window.parent.document.cookie;
  // console.log("cookieStr==", cookieStr);
  if (!cookieStr) return "";

  const cookies = cookieStr.split(";");
  const targetCookie = cookies.find(ele => ele.includes(key));
  if (!targetCookie) return "";

  const values = targetCookie.split("=");
  return values[1] || "";
};

export interface ITimerOption {
  timer: any;
}
export const debounce = (fn: (args: any[]) => void, delay: number, timerOption: ITimerOption = { timer: 0 }) => {
  // console.log("防抖函数====");
  // 1.定义一个定时器, 保存上一次的定时器
  // let timer: number;

  // 2.真正执行的函数
  const _debounce = function (...args: any[]) {
    // 取消上一次的定时器
    // console.log("=======timer======", timerOption?.timer);
    if (timerOption?.timer) clearTimeout(timerOption.timer);
    // console.log(this);
    // 延迟执行
    timerOption!.timer = setTimeout(() => {
      // 外部传入的真正要执行的函数
      // fn.apply(this, args);
      fn(args);
    }, delay);
  };

  return _debounce;
};
/**
 * 节流函数
 */
let throttleLastTime: any = null;
export const throttle = (fn: (args: any[]) => void, delay: number): any => {
  return function (...args: any[]) {
    if (throttleLastTime) {
      return;
    }
    throttleLastTime = setTimeout(() => {
      fn(args);
      throttleLastTime = null;
    }, delay);
  };
};
/**
 * 防抖函数
 */
let debounceLastTime: any = null;
export const _debounce = (fn: (args: any[]) => void, delay: number): any => {
  return function (...args: any[]) {
    if (debounceLastTime) clearTimeout(debounceLastTime);
    debounceLastTime = setTimeout(() => {
      fn(args);
      debounceLastTime = null;
    }, delay);
  };
};
export const handleClose = () => {
  window.parent.cloudOpenWindow(true);
};

/**
 * 获取与当前时间的时间差
 * @param {String | Number} target 日期时间 字符串 | 时间戳
 * @returns 传入的日期时间 与 现在的 时间差(时间戳)000000
 */
export const spaceTimeSecond = (target: string | number) => {
  let target_code = 0;
  //判断是否时间戳
  if (typeof target === "number") {
    //日期时间 时间戳
    target_code = target;
  } else if (typeof target === "string") {
    // throw "type error";
    //日期时间 字符串
    target = target.replaceAll("-", "/"); //兼容ios系统
    const typeArr = target.split(" ");
    const ymd = typeArr[0];
    let hms = typeArr[1];
    if (hms && hms.split(":").length !== 3) {
      throw "type error";
    }

    if (!hms) hms = "00:00:00";

    target_code = new Date(`${ymd} ${hms}`).getTime();
    target_code = Math.floor(target_code / 1000); // 转 秒
  }

  let now_code = new Date().getTime();
  now_code = Math.floor(now_code / 1000);
  return target_code - now_code;
};

/**
 * 获取当前时间距离某日期时间 还要几天 几小时 几分钟 几秒
 * @param {String} target 日期时间 字符串
 * @returns Object
 */
export const spaceTime = (target: string | number) => {
  let day = 0;
  let hour = 0;
  let minute = 0;
  let second = 0;

  let space = spaceTimeSecond(target); // 差值 秒
  if (space <= 0) {
    // throw "日期错误";
    return {
      day,
      hour,
      minute,
      second,
    };
  }
  if (space > day_s) {
    day = Math.floor(space / day_s);
    space = space % day_s;
  }
  if (space > hour_s) {
    hour = Math.floor(space / hour_s);
    space = space % hour_s;
  }
  if (space > minute_s) {
    minute = Math.floor(space / minute_s);
    space = space % minute_s;
  }
  second = space;

  return {
    day,
    hour,
    minute,
    second,
  };
};

/**
 * 身份证验证
 * @param {String} target 日期时间 字符串
 * @returns Object
 */

export function IdCodeValid(id_no: any) {
  let row = true;
  let msg = "验证成功";
  if (!id_no) {
    row = false;
    msg = "请输入身份证号码";
    return {
      success: row,
      message: msg,
    };
  }
  if (id_no.length < 18) {
    row = false;
    msg = "身份证号码格式不正确";
    return {
      success: row,
      message: msg,
    };
  }
  const reg = /^(^\d{18}$|^\d{17}(\d|X|x))$/;
  if (!reg.test(id_no)) {
    row = false;
    msg = "身份证号码格式不正确";
    return {
      success: row,
      message: msg,
    };
  }

  let c = 0;
  const p = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  for (let i = 0; i < 17; i++) {
    let n = id_no.substr(i, 1);
    n = parseInt(n);
    c += p[i] * n;
  }

  const y = c % 11;
  const r = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
  let v = r[y] as string | number;
  if (v == 10) {
    v = "x";
  }
  const l = id_no.substr(17, 1);

  if (v != l.toLowerCase()) {
    row = false;
    msg = "身份证号码校验码不正确";
    return {
      success: row,
      message: msg,
    };
  }
  return { success: row, message: msg };
}
export function getInfoByIdCard(IdCard: any) {
  if (IdCard.length == 18) {
    const birthday = IdCard.substring(6, 10) + "-" + IdCard.substring(10, 12) + "-" + IdCard.substring(12, 14);
    //获取性别
    let sex = "";
    if (parseInt(IdCard.substr(16, 1)) % 2 === 1) {
      sex = "1";
    } else {
      sex = "2";
    }

    //获取年龄
    const ageDate = new Date();
    const month = ageDate.getMonth() + 1;
    const day = ageDate.getDate();
    let age = ageDate.getFullYear() - IdCard.substring(6, 10) - 1;
    if (IdCard.substring(10, 12) < month || (IdCard.substring(10, 12) === month && IdCard.substring(12, 14) <= day)) {
      age++;
    }
    if (age <= 0) {
      age = 1;
    }
    return { birthday: birthday, sex: sex, age: age };
  } else {
    return false;
  }
}
