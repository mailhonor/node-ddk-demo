# node-ddk-demo

## 说明

node-dddk 是 ELECTRON 开发框架, 封装常见操作

```ts
npm i node-ddk
```

本项目是一个DEMO, 下载后再看

项目地址: https://github.com/mailhonor/node-ddk-demo

```ts
git clone https://github.com/mailhonor/node-ddk-demo
cd node-ddk-demo
npm i
npm run dev
// npm run build
```

### 目录结构
```ts
// 代码路径
src/
// 主进程
src/main
// 预加载
src/main/preload.ts
// 主进程入口
src/main/main.ts
// 渲染进程
src/renderer
// 渲染进程入口
src/renderer/app.ts
```

## API 接口, 用法

见项目源码, 里面有用法和说明

### 主进程, 几个小例子
```ts
import main, { NODEDDK } from "node-ddk/main"

// 设置图标
main.app.setFavicon(main.app.getPathInPublic("icons/favicon.png"))

// 托盘右键菜单
main.tray.setContextMenu([
  {
    label: "显示主窗口",
    click: async () => { }
  },
  {
    label: "退出",
    click: async () => { }
  },
])

// 注册一个自定义的服务
main.ipc.registerListenModule("do-sth", async (req) => {
  console.log("do-sth req:", req)
  return {
    data: { ccc: "nihao", yourReqData: req.data, versions: process.versions },
  }
})

```

### 渲染进程, 几个用法
```ts
import renderer, { NODEDDK } from "node-ddk/renderer"

// 窗口最大化
await renderer.window.maximize()

// 内容缩放, 扩大到 120%
await renderer.window.setZoomFactor(1.2)

// 托盘闪动 10s, 托盘提示为 test
renderer.tray.startFlashing({ period: 10 * 1000, tooltip: "test" })

// 用操作系统默认程序, 打开文件
await renderer.shell.openLocalFile({ path: "/etc/resolv.conf" })
```