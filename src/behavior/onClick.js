import { lazyReportBatch } from "../report";
import { generateUniqueId } from "../utils";

// 监听用户点击事件
export default function onClick() {
  ["mousedown", "touchstart"].forEach((eventType) => {
    window.addEventListener(eventType, (e) => {
      const target = e.target;
      //如果点击事件存在
      if (target.tagName) {
        const reportData = {
          //根据业务需求，增加reportData的内容
          // scrollTop: document.documentElement.scrollTop,
          type: "behavior",
          subType: "click",
          target: target.tagName,
          startTime: e.timeStamp,
          innerHtml: target.innerHTML,
          outerHtml: target.outerHTML,
          with: target.offsetWidth,
          height: target.offsetHeight,
          eventType,
          path: e.path,
          uuid: generateUniqueId(),
        };
        lazyReportBatch(reportData);
      }
    });
  });
}
