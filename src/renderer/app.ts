import renderer, { NODEDDK } from "node-ddk/renderer"

let w = renderer.window
function debugShow(s: any) {
    function show(s: any) {
        if (typeof s == "object") {
            console.log(JSON.stringify(s, undefined, " "), s)
        } else {
            console.log(s)
        }
    }
    if (typeof s == "object" && s.then) {
        s.then((s: any) => { show(s) })
    } else {
        show(s)
    }
}

function systemNotification(silent?: boolean) {
    renderer.systemNotification.notify({ title: "通知title", body: "通知正文", silent }).then(r => {
        if (r == "click") {
            debugShow("点击查看")
        } else {
            debugShow("未点击查看: " + r)
        }
    })
}

async function screenshot(hideMe?: boolean) {
    let imagedata = await renderer.desktopCapturer.screenshot("./screenShotPlugin.umd.js", { hideMe })
    if (imagedata == "") {
        debugShow("截图失败")
        return
    }
    let w = await renderer.window.openModal({
        type: "一般window.open666",
        features: "width=1000,height=800",
        aboutBlankMode: true,
    })
    if (!w) {
        debugShow("打开新窗口失败")
        return
    }
    w.document.body.style.padding = "10px"
    let o = w.document.createElement("img")
    w.document.body.append(o)
    o.style.width = "90%"
    o.src = imagedata
}

const funcs = [
    {
        label: "APP",
        list: [
            {
                "label": "窗口参数(信息)",
                "fn": () => debugShow(w.getInfo()),
            },
            {
                "label": "退出全部(强制)",
                "fn": () => renderer.app.quit(),
            },
            {
                "label": "打开 DevTools",
                "fn": () => renderer.app.openDevTools(),
            },
        ]
    },
    {
        label: "窗口操作",
        list: [
            {
                "label": "window.close",
                "fn": () => window.close(),
            },
            {
                "label": "关闭",
                "fn": () => w.close(),
            },
            {
                "label": "注册(关闭回调函数)",
                "fn": () => {
                    w.registerBeforeunloadOnce(async () => {
                        if (!window.confirm("点击确定,关闭窗口")) {
                            return false
                        }
                    })
                }
            },
            {
                "label": "关闭(强制)",
                "fn": () => w.forcedClose(),
            },
            {
                "label": "",
                "fn": () => { },
            },
            {
                "label": "最小化",
                "fn": () => w.minimize(),
            },
            {
                "label": "最大化",
                "fn": () => w.maximize(),
            },
            {
                "label": "退出最大化",
                "fn": () => w.unmaximize(),
            },
            {
                "label": "最大化/退出最大化",
                "fn": () => w.maximizeSwitch(),
            },
            {
                "label": "",
                "fn": () => { },
            },
            {
                "label": "隐藏(3秒后显示)",
                "fn": async () => { await w.hide(); setTimeout(() => w.activeAndFocus(), 3000) },
            },
            {
                "label": "splitor",
                "fn": () => { },
            },
            {
                "label": "全屏",
                "fn": () => w.setWindowFullscreen(),
            },
            {
                "label": "退出全屏",
                "fn": () => w.unsetWindowFullscreen(),
            },
            {
                "label": "splitor",
                "fn": () => { },
            },
            {
                "label": "总在最上面",
                "fn": () => w.setWindowAlwaysOnTop(),
            },
            {
                "label": "退出总在最上面",
                "fn": () => w.unsetWindowAlwaysOnTop(),
            },
            {
                "label": "",
                "fn": () => { }
            },
            {
                "label": "左上角(800x600)",
                "fn": () => w.setRectangle({ x: 0, y: 0, width: 800, height: 600 }),
            },
            {
                "label": "右下角(1000x800)",
                "fn": () => w.setRectangle({ x: screen.availWidth - 1000, y: screen.availHeight - 800 - 36, width: 1000, height: 800 }),
            },
            {
                "label": "居中",
                "fn": () => w.setCenter(),
            },
            {
                "label": "",
                "fn": () => { },
            },
            {
                "label": "缩放 60%",
                "fn": () => w.setZoomFactor(0.6),
            },
            {
                "label": "缩放 80%",
                "fn": () => w.setZoomFactor(0.8),
            },
            {
                "label": "缩放 100%",
                "fn": () => w.setZoomFactor(1),
            },
            {
                "label": "缩放 120%",
                "fn": () => w.setZoomFactor(1.2),
            },
            {
                "label": "缩放 150%",
                "fn": () => w.setZoomFactor(1.5),
            },
            {
                "label": "获取 FACTOR",
                "fn": () => debugShow(w.getZoomFactor()),
            },
        ]
    },
    {
        label: "窗口连续操作",
        list: [
            {
                "label": "左上角,1s,最大,1s,取消最大,1s,居中,1s,300x200,1s,隐藏,1s,显示,800x600,1s,放大,1s,正常,1s,全屏,1s, 退出全屏",
                "fn": () => {
                    w.operateWindowStepByStep({
                        steps: [
                            { type: "position", x: 0, y: 0 },
                            { type: "sleep", sleep: 1000 },
                            { type: "maximize" },
                            { type: "sleep", sleep: 1000 },
                            { type: "unmaximize" },
                            { type: "sleep", sleep: 1000 },
                            { type: "center" },
                            { type: "sleep", sleep: 1000 },
                            { type: "size", width: 300, height: 200 },
                            { type: "sleep", sleep: 1000 },
                            { type: "hide" },
                            { type: "sleep", sleep: 1000 },
                            { type: "show" },
                            { type: "sleep", sleep: 1000 },
                            { type: "size", width: 800, height: 600 },
                            { type: "sleep", sleep: 1000 },
                            { type: "increaseZoomFactor", factor: 0.2 },
                            { type: "sleep", sleep: 1000 },
                            { type: "setZoomFactor", factor: 1 },
                            { type: "sleep", sleep: 1000 },
                            { type: "fullscreen" },
                            { type: "sleep", sleep: 1000 },
                            { type: "unfullscreen" },
                        ]
                    })
                },
            },
        ]
    },
    {
        label: "新窗口",
        list: [
            {
                "label": "新窗口(无边框)",
                "fn": () => {
                    w.create({ type: "noframe_test" })
                },
            },
            {
                "label": "新窗口,最小 500x300",
                "fn": () => {
                    w.create({ type: "minWidthHeight" })
                },
            },
            {
                "label": "新窗口(菜单)",
                "fn": () => {
                    w.create({ type: "menu_test123" })
                },
            },
            {
                "label": "新窗口(记住状态)",
                "fn": () => {
                    w.create({ type: "test456" })
                },
            },
            {
                "label": "openModal",
                "fn": () => {
                    w.openModal({
                        type: "menu_test123",
                        "onClose": () => {
                            debugShow("模态窗关闭了")
                        },
                    })
                },
            },
            {
                "label": "窗口参数",
                "fn": () => debugShow(w.getInfo())
            },
        ]
    },
    {
        label: "系统菜单",
        list: [
            {
                "label": "新窗口(系统菜单)",
                "fn": () => {
                    w.create({ type: "menu_test123" })
                },
            },
            {
                "label": "上下文菜单",
                "fn": () => {
                    renderer.systemMenu.show({
                        menus: [
                            {
                                label: "item 1 哈哈哈哈哈哈",
                                click: () => { console.log("item 1") }
                            },
                            {
                                label: "item 2",
                                click: () => { console.log("item 2") }
                            },
                            {
                                label: "",
                                separator: true,
                            },
                            {
                                label: "item 3",
                                click: () => { console.log("item 3") }
                            },
                            {
                                type: "checkbox",
                                checked: true,
                                label: "复选框",
                            },
                        ]
                    })
                },
            },
        ]
    },
    {
        label: "托盘, 任务栏, 通知",
        list: [
            {
                "label": "闪动(10s)",
                "fn": () => { renderer.tray.startFlashing({ period: 10 * 1000, tooltip: "test" }) },
            },
            {
                "label": "停止闪动",
                "fn": () => { renderer.tray.stopFlashing() },
            },
            {
                "label": "设置tooltip",
                "fn": () => { renderer.tray.setToolTip("提醒" + (new Date()).toString() + " OK") },
            },
            {
                "label": "splitor",
                "fn": () => { },
            },
            {
                "label": "失焦任务栏闪动",
                "fn": () => w.startFlash(),
            },
            {
                "label": "splitor",
                "fn": () => { },
            },
            {
                "label": "通知",
                "fn": () => { systemNotification() },
            },
            {
                "label": "通知(无铃声)",
                "fn": () => { systemNotification(true) },
            },
        ]
    },
    {
        label: "截屏",
        list: [
            {
                "label": "截屏",
                "fn": () => { screenshot() },
            },
            {
                "label": "截屏(隐藏当前窗口)",
                "fn": () => { screenshot(true) },
            },
        ]
    },
    {
        label: "基础对话框, dialog",
        list: [
            {
                "label": "alert",
                "fn": () => { renderer.dialog.alert({ message: "message", title: "title" }) },
            },
            {
                "label": "截屏(隐藏当前窗口)",
                "fn": () => { screenshot(true) },
            },
        ]
    },
    {
        label: "对话框, dialog",
        list: [
            {
                "label": "选择一个文件(无类型)",
                "fn": () => {
                    debugShow(renderer.dialog.getOneOpenFile({
                        title: "选择一个文件",
                    }))
                },
            },
            {
                "label": "选择多个文件(文档,压缩包)",
                "fn": () => {
                    debugShow(renderer.dialog.getOpenFileList({
                        filters: [
                            { "name": "全部", "extensions": ["*"] },
                            { "name": "OFFICE", "extensions": ["doc", "docx", "ppt", "pptx"] },
                            { "name": "压缩包", "extensions": ["zip", "7z"] },
                        ]
                    }))
                },
            },
            {
                "label": "选择一个文件夹用于读",
                "fn": () => {
                    debugShow(renderer.dialog.getOneOpenDir({}))
                },
            },
            {
                "label": "",
                "fn": () => { },
            },
            {
                "label": "选择一个文件用于写(123.txt)",
                "fn": () => {
                    debugShow(renderer.dialog.getOneSaveFile({ filename: "123.txt" }))
                },
            },
            {
                "label": "选择一个文件夹用于写",
                "fn": () => {
                    debugShow(renderer.dialog.getOneSaveDir({}))
                },
            },
            {
                "label": "",
                "fn": () => { },
            },
            {
                "label": "选择文件(记住目录,abc)",
                "fn": () => {
                    debugShow(renderer.dialog.getOneOpenFile({ dirGroup: "abc" }))
                },
            },
            {
                "label": "选择文件(记住目录,def)",
                "fn": () => {
                    debugShow(renderer.dialog.getOneOpenFile({ dirGroup: "def" }))
                },
            },
        ]
    },
    {
        label: "打开 本地文件",
        list: [
            {
                "label": "打开 /etc/resolv.conf",
                "fn": async () => {
                    let r = await renderer.shell.openLocalFile({ path: "/etc/resolv.conf" })
                    if (!r) {
                        debugShow("拒绝打开")
                    }
                }
            },
            {
                "label": "拒绝打开 /etc/resolv.conf.exe",
                "fn": async () => {
                    let r = await renderer.shell.openLocalFile({ path: "/etc/resolv.conf.exe" })
                    if (!r) {
                        debugShow("拒绝打开")
                    }
                }
            },
        ]
    },
    {
        label: "文件系统, fs",
        list: [
            {
                "label": "选择一个文件并显示文件信息",
                "fn": async () => {
                    let fn = await renderer.dialog.getOneOpenFile({
                        title: "选择一个文件",
                    })
                    if (fn == "") {
                        debugShow("没选择文件")
                    }
                    debugShow(fn)
                    debugShow(renderer.fs.getFileInfo(fn))
                },
            },
            {
                "label": "选择多个文件并显示文件信息",
                "fn": async () => {
                    let fns = await renderer.dialog.getOpenFileList({
                        title: "选择多个文件",
                    })
                    if (fns.length == 0) {
                        debugShow("没选择文件")
                    }
                    debugShow(fns)
                    debugShow(renderer.fs.getFileInfoList(fns))
                },
            },
        ]
    },
    {
        label: "页面内查找",
        list: [
            {
                "label": "正向查找(关键字: 文件)",
                "fn": async () => {
                    let res = await renderer.findInPage.find({
                        text: "文件",
                        forward: true,
                    })
                    debugShow(res)
                },
            },
            {
                "label": "反向查找(关键字: 文件)",
                "fn": async () => {
                    let res = await renderer.findInPage.find({
                        text: "文件",
                        forward: false,
                    })
                    debugShow(res)
                },
            },
            {
                "label": "清理查找结果",
                "fn": async () => { await renderer.findInPage.stop() },
            },
        ]
    },
]

function CE(s: string) {
    return document.createElement(s);
}
let conDiv = document.getElementById("content");
function dispalyOneItem(item: { label: string, list: { "label": string, "fn": any, }[] }) {
    if (!conDiv) {
        return
    }
    let fieldset = CE("fieldset")
    conDiv.appendChild(fieldset)
    let legend = CE("legend")
    fieldset.append(legend)
    legend.textContent = item.label + ""
    item.list.forEach(node => {
        let span = CE("span")
        fieldset.append(span)
        if (node.label == "") {
            span.innerHTML = "<BR>"
        } else if (node.label == "splitor") {
            span.textContent = "|"
        } else {
            let bt = CE("button")
            span.append(bt)
            bt.className = "button"
            bt.addEventListener("click", () => { node.fn(); });
            bt.textContent = node.label
        }
    })
}

// 
funcs.forEach(item => {
    dispalyOneItem(item)
})

//
if (1) {
    let a = document.getElementById("openProjectA")
    if (a) {
        a.onclick = () => {
            renderer.shell.openUrl({ "url": "https://gitee.com/linuxmail/node-ddk-demo" })
        }
    }
    a = document.getElementById("openDevA")
    if (a) {
        a.onclick = () => {
            renderer.app.openDevTools()
        }
    }
}

//
const openMyfile = async () => {
    let frame: HTMLIFrameElement | null = document.getElementById("iframe") as HTMLIFrameElement
    if (frame) {
        frame.src = "myfile:///xxx/vvv/ppp/123/ffasdfasdf.txt"
    }
}

if (conDiv) {
    let div = CE("DIV")
    conDiv.append(div)
    div.innerHTML = '<fieldset><legend class="legend">自定义本地文件协议</legend><button onclick="openMyfile()" class="button">加载 myfile:///xxx/vvv/ppp/123/ffasdfasdf.txt</button><div><iframe id="iframe" class="iframe"></iframe></div></fieldset>';
    try {
        let bts = div.getElementsByTagName("button")
        bts[0].onclick = openMyfile
    } catch { }
}

//
const openSelf = async () => {
    let frame: HTMLIFrameElement | null = document.getElementById("iframe2") as HTMLIFrameElement
    if (frame) {
        frame.src = window.location.href
    }
}

const openWWWBaidu = async () => {
    let frame: HTMLIFrameElement | null = document.getElementById("iframe2") as HTMLIFrameElement
    if (frame) {
        frame.src = "https://www.baidu.com/"
    }
}

if (conDiv) {
    let div = CE("DIV")
    conDiv.append(div)
    div.innerHTML = '<fieldset><legend class="legend">加载 web 测试</legend><button onclick="openSelf()" class="button">加载 window.location.href</button><button onclick="openSelf()" class="button">加载 www.baidu.com</button><div><iframe id="iframe2" class="iframe"></iframe></div></fieldset>';
    try {
        let bts = div.getElementsByTagName("button")
        bts[0].onclick = openSelf
        bts[1].onclick = openWWWBaidu
    } catch { }
}

//
const openBaidu = () => {
    renderer.shell.openUrl({ url: "https://www.baidu.com/" })
}

const openQiandu = async () => {
    let r = await renderer.shell.openUrl({ url: "https://www.qiandu.com/" })
    if (!r) {
        debugShow("拒绝打开")
    }
}

if (conDiv) {
    let div = CE("DIV")
    conDiv.append(div)
    div.innerHTML = '<fieldset><legend class="legend">打开 URL</legend><button onclick="openBaidu()" class="button">打开 www.baidu.com</button><button onclick="openQiandu()" class="button">拒绝打开 www.qiandu.com</button><a href="https://www.baidu.com" class="button">拒绝所有的 A 标签默认操作</a> </fieldset>';
    try {
        let bts = div.getElementsByTagName("button")
        bts[0].onclick = openBaidu
        bts[1].onclick = openQiandu
    } catch { }
}

// 请求主进程的服务
const defModule = () => {
    let d: HTMLInputElement = document.getElementById("inputModule") as HTMLInputElement
    if (!d) {
        return
    }
    let req: NODEDDK.ModuleRendererRequest = {
        module: "do-sth",
        data: {
            intpuText: d.value,
        }
    }
    renderer.ipc.request(req).then((res) => {
        console.log(res)
    })
}

if (conDiv) {
    let div = CE("DIV")
    conDiv.append(div)
    div.innerHTML = '<fieldset> <legend class="legend">在主程序, 自定义IPC模块</legend> <div> <input id="inputModule" size="64" value="" /> </div> <div> <button onclick="defModule()" class="button">发送请求</button> </div> </fieldset>'
    try {
        let bts = div.getElementsByTagName("button")
        bts[0].onclick = defModule
    } catch { }
}

// 请求主窗口的服务
const defModule2 = () => {
    let d: HTMLInputElement = document.getElementById("inputModule2") as HTMLInputElement
    if (!d) {
        return
    }
    let req: NODEDDK.ModuleRendererRequest = {
        toWindowUniqueId: "main",
        module: "someModule",
        data: {
            intpuText: d.value,
        }
    }
    renderer.ipc.request(req).then((res) => {
        console.log(res)
    })
}


if (conDiv) {
    let div = CE("DIV")
    conDiv.append(div)
    div.innerHTML = '<fieldset> <legend class="legend">请求主窗口的服务</legend><div><a href="javascript:void(-1)">打开一个新窗口, 发送请求, 回主窗口看控制台</a></div> <div> <input id="inputModule2" size="64" value="" /> </div> <div> <button onclick="defModule()" class="button">发送请求</button> </div> </fieldset>'
    try {
        let bts = div.getElementsByTagName("button")
        bts[0].onclick = defModule2
        let a = div.getElementsByTagName("a")
        a[0].onclick = () => { w.create({ type: "menu_test123" }) }
    } catch { }
}

// 在窗口, 注册消息接受服务
renderer.ipc.registerMessageReceiver("someReceiver", (data) => {
    console.log("someReceiver", data)
})

// 在窗口, 注册服务
renderer.ipc.registerListenModule("someModule", async (data) => {
    console.log("someModule", data)
    return { data: { www: "I am window", lll: data.data } }
})

//
renderer.window.registerMaximizeStateOnce((isMaximized: boolean) => {
    console.log("window isMaximized changed:", isMaximized)
})

//
renderer.app.start().then(() => {
    // 这个时候, 根据 renderer.window.getInfo() 的不同, 才能激活不同的页面和数据
    console.log("windowInfo", renderer.window.getInfo())
})
