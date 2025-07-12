import { lazyReportBatch } from "../report";
import { generateUniqueId } from "../utils";

// 监听页面访问量（PV）事件
export default function pv() {
  const reportData = {
    type: "behavior",
    subType: "pv",
    startTime: performance.now(),
    pageUrl: window.location.href,
    referror: document.referrer, //来源
    uuid: generateUniqueId(),
  };
  lazyReportBatch(reportData);
}
