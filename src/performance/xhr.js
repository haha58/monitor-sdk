import { lazyReportBatch } from "../report";

export const originalProto = XMLHttpRequest.prototype;
export const originalSend = originalProto.send;
export const originalOpen = originalProto.open;

function overwriteOpenAndSend() {
  originalProto.open = function newOpen(...args) {
    this.url = args[1];
    this.method = args[0];
    originalOpen.apply(this, args);
  };
  originalProto.send = function newSend(...args) {
    this.startTime = Date.now();
    const onLoaded = () => {
      this.endTime = Date.now();
      this.duration = this.endTime - this.startTime;
      const { url, method, startTime, endTime, duration, status } = this;
      const reportData = {
        status,
        duration,
        startTime,
        endTime,
        url,
        method: method.toUpperCase(),
        type: "performance",
        success: status >= 200 && status < 300,
        subType: "xhr",
      };
      // todo 发送数据
      lazyReportBatch(reportData);
      this.removeEventListener("loadend", onLoaded, true);
    };
    //loadend 事件总是在一个资源的加载进度停止之后被触发 (例如，在已经触发“error”，“abort”或“load”事件之后)。
    this.addEventListener("loadend", onLoaded, true);
    originalSend.apply(this, args);
  };
}
export default function xhr() {
  overwriteOpenAndSend();
}
