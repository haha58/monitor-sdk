import config from "./config";
import { generateUniqueId } from "./utils";
import { addCache, getCache, clearCache } from "./cache";

export const originalProto = XMLHttpRequest.prototype;
export const originalOpen = XMLHttpRequest.prototype.open;
export const originalSend = XMLHttpRequest.prototype.send;

export function report(data) {
  if (!config.url) {
    console.error("请设置上传 url 地址");
  }
  const reportData = JSON.stringify({
    id: generateUniqueId(),
    data,
  });
  //发送数据
  // 上报数据，使用图片的方式
  if (config.isImageUpload) {
    imgRequest(reportData);
  } else {
    // 优先使用 sendBeacon
    if (window.navigator.sendBeacon) {
      return beaconRequest(reportData);
    } else {
      xhrRequest(reportData);
    }
  }
}

// 批量上报数据
export function lazyReportBatch(data) {
  addCache(data);
  const dataCache = getCache();
  console.error("dataCache", dataCache);
  //当缓存的上报条数大于配置中的条数时，就上报
  if (dataCache.length && dataCache.length > config.batchSize) {
    report(dataCache);
    clearCache();
  }
}

// 图片发送数据
export function imgRequest(data) {
  const img = new Image();
  // http://127.0.0.1:8080/api?data=encodeURIComponent(data)
  img.src = `${config.url}?data=${encodeURIComponent(JSON.stringify(data))}`;
}

// 普通ajax发送请求数据
export function xhrRequest(data) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        const xhr = new XMLHttpRequest();
        originalOpen.call(xhr, "post", config.url);
        originalSend.call(xhr, JSON.stringify(data));
      },
      { timeout: 3000 }
    );
  } else {
    setTimeout(() => {
      const xhr = new XMLHttpRequest();
      originalOpen.call(xhr, "post", url);
      originalSend.call(xhr, JSON.stringify(data));
    });
  }
}

export function isSupportSendBeacon() {
  return "sendBeacon" in navigator;
}

// const sendBeacon = isSupportSendBeacon() ? navigator.sendBeacon : xhrRequest;
export function beaconRequest(data) {
  //如果有空闲时间则上报，否则使用setTimeout上报
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        //Navigator.sendBeacon 是一个 Web API，允许开发者通过 HTTP POST 方式异步地将少量数据传输到 Web 服务器。这个方法主要用于在用户离开页面时发送统计数据，而不会影响页面卸载或下一页面的加载性能。
        /* Navigator.sendBeacon 适用于需要在页面卸载时发送数据的场景，如：
         * 用户完成页面浏览后发送分析或诊断数据。
         * 在 visibilitychange 事件中发送统计数据。
         * 替代传统的 unload 或 beforeunload 事件发送数据，因为这些方法在移动设备上可能不可靠。
         */
        window.navigator.sendBeacon(config.url, data);
      },
      { timeout: 3000 }
    );
  } else {
    setTimeout(() => {
      window.navigator.sendBeacon(config.url, data);
    });
  }
}
