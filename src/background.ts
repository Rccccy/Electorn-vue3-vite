// electron 主进程文件

import { app, BrowserWindow } from "electron";
app.whenReady().then(() => {
  // 打开一个浏览器的壳子
  const win = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true, //可以在渲染进程中使用node的api 为了安全默认是不允许的
      contextIsolation: false, // 关闭渲染进程的沙箱，防止第三方包注入木马
      webSecurity: false, // 关闭跨域检测
    },
  });
//   win.webContents.openDevTools(); //开发环境打开控制台
  // 使用进程传参，将网址传递过来
  if (process.argv[2]) {
    // 能读到就是dev环境
    win.loadURL(process.argv[2]);
  } else {
    win.loadFile("index.html"); //生产环境
  }
});
