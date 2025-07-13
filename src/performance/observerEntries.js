import { lazyReportBatch } from "../report";
import { generateUniqueId } from "../utils";

export default function observerEntries() {
  //资源请求时机
  if (document.readyState === "complete") {
    observerEvent();
  } else {
    const onLoad = () => {
      observerEvent();
      window.removeEventListener("load", onLoad, true);
    };
    window.addEventListener("load", onLoad, true);
  }
}

export function observerEvent() {
  const entryHandler = (list) => {
    //回调函数会在性能指标发生变化时被触发，它接受一个参数：entries，它是一个性能条目对象的数组，每个对象描述了一个性能条目。
    const data = list.getEntries();
    for (let entry of data) {
      if (observer) {
        observer.disconnect();
      }
      const reportData = {
        name: entry.name, // 资源的名字
        type: "performance", // 类型
        subType: entry.entryType, //类型
        sourceType: entry.initiatorType, // 资源类型
        duration: entry.duration, // 加载时间
        dns: entry.domainLookupEnd - entry.domainLookupStart, // dns解析时间
        tcp: entry.connectEnd - entry.connectStart, // tcp连接时间
        redirect: entry.redirectEnd - entry.redirectStart, // 重定向时间
        ttfb: entry.responseStart, // 首字节时间
        protocol: entry.nextHopProtocol, // 请求协议
        responseBodySize: entry.encodedBodySize, // 响应内容大小
        responseHeaderSize: entry.transferSize - entry.encodedBodySize, // 响应头部大小
        transferSize: entry.transferSize, // 请求内容大小
        resourceSize: entry.decodedBodySize, // 资源解压后的大小
        startTime: performance.now(),
        uuid: generateUniqueId(),
      };
      console.log(entry);
      lazyReportBatch(reportData);
    }
  };

  //Performance Observer 是一种 JavaScript API，用于监测页面性能指标，如资源加载时间、页面渲染时间等。它可以触发回调函数，以便收集和分析页面性能数据
  let observer = new PerformanceObserver(entryHandler);
  //observe方法用于启动性能观察器以开始监测指定类型的性能条目。options 方法接受一个参数，参数要求时对象形式，其中包含要监测的性能条目类型（entryTypes）和一个回调函数，用于处理观察到的性能条目。当指定的性能条目可用时，会触发回调函数。
  //resource  资源加载耗时
  observer.observe({ type: ["resource"], buffered: true });
}
