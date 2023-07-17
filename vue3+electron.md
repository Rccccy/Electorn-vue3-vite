### vue3 + vite + electron
1. npm init vite
2. pnpm i electron electron-builder -D
3. src下创建background.ts 作为electron主进程文件
4. 根目录下创建plugin文件夹 
    - 该文件下创建 vite.electron.dev.ts   // 开发环境插件
    - 创建 vite.electron.build.ts   // 生产环境插件
    - 目的是为了在一个shell中进行开发


### 手动实现热更新
