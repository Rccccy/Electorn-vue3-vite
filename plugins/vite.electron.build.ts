// 生产环境下的插件electron
import type { Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";
import * as electronBuilder from "electron-builder";

const buildBackground = () => {
  // 加入一个esbuild，用来编译background.ts
  require("esbuild").buildSync({
    entryPoints: ["src/background.ts"],
    bundle: true,
    outfile: "dist/background.js",
    platform: "node", // 配置node环境
    target: "node12", //node版本
    external: ["electron"],
  });
};

// 打包需要 先等vite打完包之后就有index.html文件了，再执行electron的打包命令
export const ElectronBuildPlugin = (): Plugin => {
  return {
    name: "electron-build",
    // 这个钩子会在vite打完包之后执行
    closeBundle() {
      buildBackground();
      // electron-builder 需要指定package.json main
      const json = JSON.parse(fs.readFileSync("package.json", "utf8"));
      json.main = "background.js";
      fs.writeFileSync("dist/package.json", JSON.stringify(json, null, 4));

      // bug electron-builder 他会给你下载垃圾文件，解决这个bug
      fs.mkdirSync("dist/node_modules");

      electronBuilder.build({
        config: {
          directories: {
            output: path.resolve(process.cwd(), "release"), //输出文件
            app: path.resolve(process.cwd(), "dist"), // 基于dist目录进行打包
          },

          asar: true, //压缩包
          appId: "app",
          productName: "vite-app",
          //安装的配置
          nsis: {
            oneClick: false, //取消一键安装
            allowToChangeInstallationDirectory: true, //允许用户选择安装目录
          },
        },
      });
    },
  };
};
