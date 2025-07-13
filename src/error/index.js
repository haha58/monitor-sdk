import { lazyReportBatch } from "../report";
import { generateUniqueId } from "../utils";

export default function error() {
  // 捕获资源加载失败的错误： js css  img
  window.addEventListener(
    "error",
    function (e) {
      const target = e.target;
      if (target.src || target.href) {
        const url = target.src || target.href;
        const reportData = {
          type: "error",
          subType: "resource",
          url,
          html: target.outerHTML,
          pageUrl: window.location.href,
          pahts: e.path,
          uuid: generateUniqueId(),
        };
        // todo 发送错误信息
        lazyReportBatch(reportData);
      }
    },
    true
  );
  // 捕获js错误
  window.onerror = function (msg, url, lineNo, columnNo, error) {
    const reportData = {
      type: "error",
      subType: "js",
      msg,
      url,
      lineNo,
      columnNo,
      stack: error.stack,
      pageUrl: window.location.href,
      startTime: performance.now(),
      uuid: generateUniqueId(),
    };
    // todo 发送错误信息
    lazyReportBatch(reportData);
  };
  // 捕获promise错误  asyn await
  window.addEventListener(
    "unhandledrejection",
    function (e) {
      const reportData = {
        type: "error",
        subType: "promise",
        reason: e.reason?.stack,
        pageUrl: window.location.href,
        startTime: e.timeStamp,
        uuid: generateUniqueId(),
      };
      // todo 发送错误信息
      lazyReportBatch(reportData);
    },
    true
  );
}
