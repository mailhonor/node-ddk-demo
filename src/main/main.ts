import main, { NODEDDK } from "node-ddk/main"

// 设置 data 和 session 路径, 否则用默认的路径
// main.app.setDataPath({ path: require("path").join(main.app.getAppPath(), "my_run_data") })
// main.app.setDataPath({ path: "/home/xxx/mycode/nodejs/node-ddk/data" })

// 设置 session 路径, 否则用默认的路径
// main.app.setSessionPath({ path: "/home/xxx/mycode/nodejs/node-ddk/data/session" })

// 图标
main.app.setFavicon(main.app.getPathInPublic("icons/favicon.png"))

// 设置窗口类型, 一般情况,不用调用此函数
main.window.setWindowTypes([
  {
    type: "main",
    menu: true,
    devTools: true,
    autoDevTools: true,
    windowStateType: "123",
  },
  {
    type: "noframe_test",
    frame: false,
  },
  {
    type: "minWidthHeight",
    minWidth: 500,
    minHeight: 300,
  },
  {
    type: "menu_test123",
    minWidth: 500,
    minHeight: 300,
    menu: true,
  },
  {
    type: "test456",
    minWidth: 500,
    minHeight: 300,
    windowStateType: "test_type"
  },
  {
    type: "一般window.open666",
  },
])

// 根据窗口类型, 设置自定义菜单
main.menu.setMenuByWindowType("menu_test123", [
  {
    label: "abc",
    submenu: [
      {
        label: "123",
        click: () => {
          console.log("AAAAAAAAAAAAAAAAAA")
        }
      },
      {
        label: "全选",
        role: "selectAll",
      },
    ]
  },
])

// 托盘 icon
{
  let favicon_fn = "favicon.png"
  let favicon_fn_blank = "favicon_blank.png"
  let mdir = "../public/icons"
  if (main.app.isPackaged) {
    mdir = "../dist/icons"
  }
  main.tray.setDefaultImage(main.app.getPathInPublic("icons/favicon.png"))
  main.tray.setBlankImage(main.app.getPathInPublic("icons/favicon_blank.png"))
}
// 托盘点击
main.tray.setShowHideSwitchMainWindowOnClick()

// 托盘右键菜单
main.tray.setContextMenu([
  {
    label: "显示主窗口",
    click: async () => {
      let w = await main.window.getMainWindow()
      if (w) {
        w.showInactive()
        w.show()
      }
    }
  },
  {
    label: "退出",
    click: async () => {
      main.app.quit()
    }
  },
])

// 检查需要用浏览器打开的地址, 默认拒绝
main.shell.registerOpenUrlChecker(async (attrs: NODEDDK.OpenUrlOptions) => {
  let url = attrs.url
  if (url.indexOf("qiandu.com") > -1) {
    return false
  }
  return true
})

// 检查需要用本地程序打开的文件, 默认拒绝
main.shell.registerOpenLocalFileChecker(async (attrs: NODEDDK.OpenLocalFileOptions) => {
  let path = attrs.path
  if (path.endsWith(".exe")) {
    return false
  }
  return true
})

//
main.protocol.registerFileProtocol({
  protocol: "myfile",
  realpath: async (options: NODEDDK.FileProtocolRealpathOptions) => {
    return "/etc/resolv.conf"
  }
})


// 注册一个自定义的服务
main.ipc.registerListenModule("do-sth", async (req) => {
  console.log("do-sth req:", req)
  return {
    data: { ccc: "nihao", yourReqData: req.data, versions: process.versions },
  }
})

// 向 (主)窗口发送消息
setInterval(() => {
  main.ipc.sendMessage("someReceiver", { lalalla: "啦啦啦" })
}, 8 * 1000)

// 连接 (主)窗口服务
setInterval(() => {
  main.ipc.request({ toWindowUniqueId: "main", module: "someModule", data: { lalalla: "啦啦啦" } }).then(res => {
    console.log("someModule response:", res)
  })
}, 8 * 1000)

// 
main.app.setOpenFile((fn) => {
  console.log("open file:", fn);
})

// 启动
main.app.start().then(() => { })