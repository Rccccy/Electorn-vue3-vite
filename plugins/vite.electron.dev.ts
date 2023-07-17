// 开发环境下的插件electron
import type { Plugin } from "vite";
import fs from "node:fs";
import type { AddressInfo } from "net";
import { spawn } from "child_process";

//vite 插件要求必须导出一个对象，这个对象必须有name属性
// 这个对象有很多钩子

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
export const ElectronDevPlugin = (): Plugin => {
  return {
    name: "electron-dev",
    // 这个钩子 是用于配置开发服务器的
    configureServer(server) {
      buildBackground();
      server.httpServer?.once("listening", () => {
        // 读取vite服务的信息
        const addressInfo = server.httpServer?.address() as AddressInfo;
        // 拼接IP地址  给electron 启动服务的时候要用
        const IP = `http://localhost:${addressInfo.port}`;
        // 第一个参数是要运行的shell命令  ,下面require返回的是一个路径  electron不认识ts需要编译成为js文件
        // 进程穿参发送给electron IP地址
        // 获取进程
        let electronProcess = spawn(require("electron"), [
          "dist/background.js",
          IP,
        ]);
        fs.watchFile("src/background.ts", () => {
          electronProcess.kill(); // 杀死进程，否则会重新打开一个新的窗口
          buildBackground();
          // 重新启动进程
          electronProcess = spawn(require("electron"), [
            "dist/background.js",
            IP,
          ]);
          electronProcess.stderr.on("data", (data) => {
            console.log("日志", data.toString());
          });
        });
      });
    },
  };
};
