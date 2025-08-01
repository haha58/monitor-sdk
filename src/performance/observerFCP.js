import { lazyReportBatch } from "../report";
import { generateUniqueId } from "../utils";

export default function observerFCP() {
  const entryHandler = (list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === "first-contentful-paint") {
        observer.disconnect();
        const json = entry.toJSON();
        console.log(json);
        const reportData = {
          ...json,
          type: "performance",
          subType: entry.name,
          pageUrl: window.location.href,
          uuid: generateUniqueId(),
        };
        console.log("reportData", reportData);
        lazyReportBatch(reportData);
      }
    }
  };
  // 统计和计算fcp的时间
  const observer = new PerformanceObserver(entryHandler);
  // buffered: true 确保观察到所有paint事件
  observer.observe({ type: "paint", buffered: true });
}
