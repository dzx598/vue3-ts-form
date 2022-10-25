export default class WSConnector {
  connection;
  serverURL;
  uploadUrl;
  width;
  height;
  times = 10;
  delay = 200;
  framerate;
  maxDealms = 20;
  skipNum = 0;
  skipNext = false;
  ready = false;
  degree = 0;
  displayElementId;
  dw;
  dh;
  imgWidth;
  imgHeight;
  // 指令结果集
  cmdResMap = new Map();
  // 心跳检测
  heartInterval;
  heartcheckMillisecond = 3000;
  // eslint-disable-next-line camelcase
  cmd_callback_list = {};
  lastImg = null;
  doScreenShot = false;
  status = 0;

  constructor(serverURL, displayElementId, uploadUrl, dw, dh) {
    // console.log("init");
    this.serverURL = serverURL;
    this.uploadUrl = uploadUrl;
    this.displayElementId = displayElementId;
    this.dw = dw;
    this.dh = dh;

    if (typeof MozWebSocket != "undefined") {
      this.connection = new MozWebSocket(this.serverURL);
    } else {
      this.connection = new WebSocket(this.serverURL);
    }
    this.ready = true;
  }
  reConnected() {
    if ((this.connection == null || this.connection.readyState == 3 || this.connection.readyState == 4) && this.serverURL) {
      if (typeof MozWebSocket != "undefined") {
        this.connection = new MozWebSocket(this.serverURL);
      } else {
        this.connection = new WebSocket(this.serverURL);
      }
      this.ready = true;
    }
  }
  getData(key) {
    let that = this;

    let p = new Promise(function (resolve, reject) {
      setTimeout(function () {
        let data = that.cmdResMap.get(key);
        if (data) {
          delete that.cmdResMap[key];

          resolve(data);
        } else {
          reject("未接收到結果");
        }
      }, 500);
    });
    return p;
  }
  createCmdId() {
    // return (this.cdmIdCount++) +"";
    return new Date().getTime() + "";
  }
  sendCmd(cmd, params) {
    // debugger

    // console.log(params)
    let that = this;
    let cmdId = that.createCmdId();
    let cnt = 20;
    let interval = setInterval(function () {
      if (cnt > 0) {
        // console.log(that.connection.readyState + ';' + that.ready)
        if (that.connection.readyState == 1 && that.ready) {
          that.connection.send(
            JSON.stringify({
              cmd: cmd,
              params: Object.assign(params, { cmdId: cmdId }),
            })
          );
          // console.log(JSON.stringify({
          //   'cmd': cmd,
          //   'params': Object.assign(params, {cmdId: cmdId})
          // }))
          clearInterval(interval);
        } else {
          // console.log('尝试发送CMD：' + cmd + ',' + cnt)
          cnt--;
        }
      } else {
        clearInterval(interval);
      }
    }, 100);
    return cmdId;
  }
  refreshContent(displayElementId) {
    let that = this;
    setInterval(function () {
      document.getElementById(that.displayElementId).getContext("2d").clearRect(0, 0, that.width, that.height);
    }, 10000);
  }
  addContentListener(callback) {
    let that = this;
    that.connection.onopen = function () {
      that.ready = true;
      // that.startCheck()
    };
    that.connection.onmessage = function (evt) {
      // console.log('evt.data====' + evt.data)
      // console.log(evt)
      if (typeof evt.data != "string" && that.skipNext && that.skipNum > 0) {
        that.skipNum--;
        if (that.skipNum == 0) {
          that.skipNext = false;
        }
      } else {
        if (typeof evt.data == "string" && evt.data) {
          console.log(evt.data);
          // console.log(evt.data)
          let data = JSON.parse(evt.data);

          switch (data.cmd) {
            case "getResolution": {
              that.width = data.width;
              that.height = data.height;
              that.ready = true;
              that.cmdResMap.set(data.cmdId, data);
              that.cmd_callback_list["getResolution" + "_" + data.cmdId](data);
              delete that.cmd_callback_list["getResolution" + "_" + data.cmdId];
              break;
            }
            case "beginMonitor": {
              that.width = data.width;
              that.height = data.height;
              that.imgWidth = data.width;
              that.imgHeight = data.height;
              that.degree = 0;
              that.framerate = data.framerate;
              that.ready = true;
              that.maxDealms = Math.floor((1000 / that.framerate) * 0.7);
              that.cmdResMap.set(data.cmdId, data);
              that.cmd_callback_list["beginMonitor" + "_" + data.cmdId](data);
              delete that.cmd_callback_list["beginMonitor" + "_" + data.cmdId];
              // console.log(data)
              break;
            }
            case "changeRate": {
              that.width = data.width;
              that.height = data.height;
              that.imgWidth = data.width;
              that.imgHeight = data.height;
              that.degree = 0;
              that.framerate = data.framerate;
              that.drawLoading();
              console.log(data);
              break;
            }
            case "endMonitor": {
              that.cmdResMap.set(data.cmdId, data);
              that.cmd_callback_list["endMonitor" + "_" + data.cmdId](data);
              delete that.cmd_callback_list["endMonitor" + "_" + data.cmdId];
              break;
            }
            case "screenShot": {
              that.cmdResMap.set(data.cmdId, data);
              that.cmd_callback_list["screenShot" + "_" + data.cmdId](data);
              delete that.cmd_callback_list["screenShot" + "_" + data.cmdId];

              break;
            }
            case "beginVideo": {
              that.cmdResMap.set(data.cmdId, data);
              // console.log(data)
              // console.log('rec cmdID：' + data.cmdId + ';' + data)

              that.cmd_callback_list["beginVideo" + "_" + data.cmdId](data);
              delete that.cmd_callback_list["beginVideo" + "_" + data.cmdId];

              break;
            }
            case "endVideo": {
              that.cmdResMap.set(data.cmdId, data);

              // console.log(data)
              that.cmd_callback_list["endVideo" + "_" + data.cmdId](data);
              delete that.cmd_callback_list["endVideo" + "_" + data.cmdId];

              break;
            }
            case "rotate": {
              let tmp = that.width;
              that.width = that.height;
              that.height = tmp;
              that.cmdResMap.set(data.cmdId, data);

              // console.log(data)
              that.cmd_callback_list["rotate" + "_" + data.cmdId](data);
              delete that.cmd_callback_list["rotate" + "_" + data.cmdId];
              break;
            }

            default: {
            }
          }
        } else if (evt.data) {
          let start = new Date();
          if (that.ready) {
            let url = URL.createObjectURL(evt.data);
            that.lastImg = evt.data;
            let img = new Image();
            img.src = url;
            img.onload = function () {
              if (that.width && that.height) {
                callback(img);
              }
              let cost = new Date() - start;

              // console.log(cost)
              if (cost > that.maxDealms) {
                that.skipNum = Math.ceil(cost / that.maxDealms);
                that.skipNext = true;
                // console.log("cost:" + cost )
              } else {
                that.skipNum = 0;
                that.skipNext = false;
              }
            };
            that.lastImgData = evt.data;
          }
        }
      }
    };
  }
  drawLoading() {
    let that = this;
    let canvas = document.getElementById(that.displayElementId);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "40px Arial";
    ctx.fillText("加载中...", canvas.width / 2 - 130, canvas.height / 2 - 20);
  }
  getResolution(callback, exparams = {}, times = 10, delay = 200) {
    let that = this;

    let cmdId = this.sendCmd("getResolution", { ...exparams, ...{} });
    if (typeof callback == "function") {
      that.cmd_callback_list["getResolution" + "_" + cmdId] = callback;
    }
    return that.createPromise(cmdId, times, delay);
  }
  beginMonitor(callback, exparams = {}, times = 10, delay = 200) {
    let that = this;

    let cmdId = that.sendCmd("beginMonitor", { ...exparams, ...{} });
    if (typeof callback == "function") {
      that.cmd_callback_list["beginMonitor" + "_" + cmdId] = callback;

      console.log(cmdId);
    }
    // debugger
    return that.createPromise(cmdId, times, delay);
  }
  endMonitor(callback, exparams = {}, times = 10, delay = 200) {
    let that = this;

    let cmdId = this.sendCmd("endMonitor", { ...exparams, ...{} });
    if (typeof callback == "function") {
      that.cmd_callback_list["endMonitor" + "_" + cmdId] = callback;
    }

    return that.createPromise(cmdId, times, delay);
  }
  getPhoto() {
    let that = this;

    let p = new Promise(function (resolve, reject) {
      setTimeout(function () {
        let data = that.screen;
        if (data) {
          that.screen = null;
          resolve(data);
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject("未接收到結果");
        }
      }, 500);
    });
    return p;
  }
  screenShot(callback, times = 10, delay = 200) {
    let that = this;
    if (that.status == 1) {
      if (that.lastImg) {
        let reader = new FileReader();
        reader.readAsDataURL(that.lastImg);
        reader.onload = function (e) {
          // eslint-disable-next-line standard/no-callback-literal
          callback({
            base64: reader.result,
            status: that.status,
            degree: that.degree,
          });
        };
      }
    } else {
      // eslint-disable-next-line standard/no-callback-literal
      callback({
        status: that.status,
      });
    }
  }
  // screenShot(callback, times = 10, delay = 200) {
  //   let that = this
  //
  //   let cmdId = this.sendCmd('screenShot',
  //     {}
  //   )
  //   if (typeof callback == 'function') {
  //     that.cmd_callback_list['screenShot' + '_' + cmdId] = callback
  //   }
  //   return that.createPromise(cmdId, times, delay)
  // }
  rotate(callback, exparams = {}, times = 10, delay = 200) {
    let that = this;
    if (exparams.type == 1) {
      that.degree = (that.degree + 90) % 360;
    } else if (exparams.type == 0) {
      that.degree = (that.degree - 90) % 360;
    }

    if (that.degree < 0) {
      that.degree = that.degree + 360;
    }
    console.log(that.degree);
  }
  beginVideo(callback, callbackTimeout, exparams = {}, times = 10, delay = 200) {
    let that = this;
    let cmdId = this.sendCmd("beginVideo", {
      ...exparams,
      ...{
        uploadUrl: that.uploadUrl,
      },
    });
    if (typeof callback == "function") {
      that.cmd_callback_list["beginVideo" + "_" + cmdId] = callback;
    }
    if (typeof callbackTimeout == "function") {
      that.cmd_callback_list["endVideo" + "_" + cmdId] = callbackTimeout;
    }
    return that.createPromise(cmdId, times, delay);
  }
  endVideo(callback, exparams = {}, times = 10, delay = 200) {
    let that = this;

    let cmdId = this.sendCmd("endVideo", { ...exparams, ...{} });
    if (typeof callback == "function") {
      that.cmd_callback_list["endVideo" + "_" + cmdId] = callback;
    }
    return that.createPromise(cmdId, times, delay);
  }

  // rotate(callback, exparams = {}, times = 10, delay = 200) {
  //   if (exparams.type == 1) {
  //     this.degree = (this.degree + 90) % 360
  //   } else if (exparams.type == 0) {
  //     this.degree = (this.degree - 90) % 360
  //   }
  //
  // }
  createPromise(cmdId, times, delay) {
    let that = this;
    return new Promise((resolve, reject) => {
      function attempt() {
        that
          .getData(cmdId)
          .then(resolve)
          .catch(function (data) {
            // console.log(`还有 ${times} 次尝试`)
            if (times == 0) {
              reject(data);
            } else {
              times--;
              setTimeout(attempt(), delay);
            }
          });
      }
      attempt();
    });
  }
  start(callback) {
    let that = this;
    that.drawLoading();
    if ((that.connection == null || that.connection.readyState == 3 || that.connection.readyState == 4) && that.serverURL) {
      that.reConnected();
    }
    that.addContentListener(function (img) {
      if (that.degree == 90 || that.degree == 270) {
        that.imgWidth = that.height;
        that.imgHeight = that.width;
      } else {
        that.imgWidth = that.width;
        that.imgHeight = that.height;
      }

      let front = document.getElementById(that.displayElementId);
      if (!front) return;

      let back = document.createElement("canvas");
      front.width = that.dw;
      front.height = that.dh;
      back.width = front.width;
      back.height = front.height;
      let rw;
      let rh;
      if (that.imgWidth / that.dw > that.imgHeight / that.dh) {
        rw = that.dw;
        rh = that.imgHeight / (that.imgWidth / that.dw);
      } else {
        rw = that.imgWidth / (that.imgHeight / that.dh);
        rh = that.dh;
      }
      let dx = Math.abs(rw - back.width) / 2;
      let dy = Math.abs(rh - back.height) / 2;

      let ctx = front.getContext("2d");
      let bctx = back.getContext("2d");
      let direction = (that.degree / 90) % 4;
      // debugger

      switch (direction) {
        case 0:
          bctx.drawImage(img, 0, 0, that.imgWidth, that.imgHeight, dx, dy, rw, rh);
          break;
        case 1:
          bctx.translate(rw * 0.5, rh * 0.5);
          bctx.rotate((that.degree * Math.PI) / 180);
          bctx.drawImage(img, 0, 0, that.imgHeight, that.imgWidth, -rh / 2 - dy, -rw / 2 - dx, rh, rw);
          break;
        case 2:
          bctx.translate(rw * 0.5, rh * 0.5);
          bctx.rotate((that.degree * Math.PI) / 180);
          bctx.drawImage(img, 0, 0, that.imgWidth, that.imgHeight, -rw / 2 - dx, -rh / 2 - dy, rw, rh);
          break;
        case 3:
          bctx.translate(rw * 0.5, rh * 0.5);
          bctx.rotate((that.degree * Math.PI) / 180);
          bctx.drawImage(img, 0, 0, that.imgHeight, that.imgWidth, -rh / 2 + dy, -rw / 2 + dx, rh, rw);
          break;
      }

      ctx.drawImage(back, 0, 0);
      // URL.revokeObjectURL(img.src)
    });
    that.beginMonitor(callback, {}).then(function () {
      if (that.ready) {
        that.status = 1;
        console.log("websocket连接成功");
      } else {
        console.error("websocket连接失败,未获取到图片相关信息");
      }
    });
    return that;
  }
  disConnect(callback, times = 10, delay = 200) {
    let that = this;
    return new Promise((resolve, reject) => {
      that
        .endMonitor(callback, {}, times, delay)
        .then(() => {
          try {
            clearInterval(that.heartInterval);
            // that.connection.close()
            that.degree = 0;
            let canvas = document.getElementById(that.displayElementId);
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = "40px Arial";
            ctx.fillText("摄像头已关闭", canvas.width / 2 - 160, canvas.height / 2 - 20);
            that.status = 2;
            resolve(true);
          } catch (error) {
            console.log(error, "插件 trycatch disConnect");
            reject(false);
          }
        })
        .catch(error => {
          console.log(error, "插件 函数 disConnect");
          reject(false);
        });
    });
  }
  startCheck() {
    let that = this;
    let interval = setInterval(function () {
      that.sendCmd("check", {});
    }, that.heartcheckMillisecond);

    that.heartInterval = interval;
  }
}
