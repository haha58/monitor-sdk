import { lazyReportBatch } from "../report";
import { generateUniqueId } from "../utils";

export default function observerLoad() {
  //当一条会话历史记录被执行的时候将会触发页面显示 (pageshow) 事件。(这包括了后退/前进按钮操作，同时也会在 onload 事件触发后初始化页面时触发)
  window.addEventListener("pageShow", function (event) {
    requestAnimationFrame(() => {
      //Window Loaded 事件在整个页面及其所有依赖资源（如样式表和图片）都已完成加载时触发。与 DOMContentLoaded 事件不同，后者只要页面 DOM 加载完成就触发，无需等待依赖资源的加载
      ["load"].forEach((type) => {
        const reportData = {
          type: "performance",
          subType: type,
          pageUrl: window.location.href,
          startTime: performance.now() - event.timeStamp,
          uuid: generateUniqueId(),
        };
        lazyReportBatch(reportData)
      });
    }, true);
  });
}
