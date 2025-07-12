import { lazyReportBatch } from "../report";
import { generateUniqueId } from "../utils";

// 监听页面路由变化
export default function pageChange() {
  // hash路由
  let oldUrl = "";
  window.addEventListener(
    "hashchange",
    function (event) {
      console.error("hashchange", event);
      const newUrl = event.newURL;
      const reportData = {
        form: oldUrl,
        to: newUrl,
        type: "behavior",
        subType: "hashchange",
        startTime: performance.now(),
        uuid: generateUniqueId(),
      };
      lazyReportBatch(reportData);
      oldUrl = newUrl;
    },
    true
  );

  //history路由
  let from = "";
  window.addEventListener(
    "popstate",
    function (event) {
      console.error("popstate", event);
      const to = window.location.href;
      const reportData = {
        form: from,
        to: to,
        type: "behavior",
        subType: "popstate",
        startTime: performance.now(),
        uuid: generateUniqueId(),
      };
      lazyReportBatch(reportData);
      from = to;
    },
    true
  );
}
