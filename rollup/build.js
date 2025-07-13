const path = require("path");
const json = require("@rollup/plugin-json"); //用于将 JSON 文件作为模块导入
const { babel } = require("@rollup/plugin-babel"); //用于使用 Babel 转译 JavaScript/TypeScript 代码
const resolveFile = function (filePath) {
  return path.join(__dirname, filePath);
};
// 插件配置
const plugins = [
  //json 插件配置为 compact: true，表示输出的 JSON 会被压缩（去除空格和换行）。
  json({
    compact: true,
  }),
  //babel 插件配置指定了处理的文件扩展名为 .js 和 .ts，babelHelpers 设置为 "bundled" 表示将 Babel 辅助函数内联到每个文件中，presets 使用了 @babel/env 并指定了目标浏览器。
  babel({
    extensions: [".js", ".ts"],
    babelHelpers: "bundled",
    presets: [
      [
        "@babel/env",
        {
          targets: {
            browsers: ["> 1%", "last 2 versions", "not ie <= 8"],
          },
        },
      ],
    ],
  }),
];
// 打包配置
module.exports = [
  {
    plugins,
    input: resolveFile("../src/webEyeSDK.js"),
    output: {
      file: resolveFile("../dist/monitor.js"),
      format: "iife", //立即执行函数
      name: "monitor",
      sourcemap: true,
    },
  },
  {
    plugins,
    input: resolveFile("../src/webEyeSDK.js"),
    output: {
      file: resolveFile("../dist/monitor.esm.js"),
      format: "esm", //es6模块化标准
      name: "monitor",
      sourcemap: true,
    },
  },
  {
    plugins,
    input: resolveFile("../src/webEyeSDK.js"),
    output: {
      file: resolveFile("../dist/monitor.cjs.js"),
      format: "cjs", //commonjs模块化标准
      name: "monitor",
      sourcemap: true,
    },
  },
];
