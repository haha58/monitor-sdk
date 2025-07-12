window.__webEyeSDK__ = {
  version: "0.0.1",
};

// 针对Vue项目的错误捕获
export function install(Vue, options) {
  if (__webEyeSDK__.vue) return;
  __webEyeSDK__.vue = true;
  const handler = Vue.config.errorHandler;
  // vue项目中 通过 Vue.config.errorHandler 捕获错误(https://vuejs.org/api/application.html#app-config-errorhandler)
  Vue.config.errorHandler = function (err, vm, info) {
    // todo: 上报具体的错误信息
    if (handler) {
      handler.call(this, err, vm, info);
    }
  };
}
// 针对React项目的错误捕获
export function errorBoundary(err, info) {
  if (__webEyeSDK__.react) return;
  __webEyeSDK__.react = true;
  // todo: 上报具体的错误信息
}

export default {
  install,
  errorBoundary,
};
