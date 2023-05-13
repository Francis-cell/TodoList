const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
const iconPath = path.join(__dirname, "./images/icos/TODO.ico")


let mainWindow, tray;

function createWindow() {
    mainWindow = new BrowserWindow({
        // 去掉自带的顶部区域
        frame: false,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // 打开开发者工具
    mainWindow.webContents.openDevTools();
    // 关闭菜单栏工具
    mainWindow.removeMenu();

    mainWindow.loadFile('index.html');


    // 实例化一个tray对象，构造函数的唯一参数是需要在托盘中显示的图标url
    tray = new Tray(iconPath)

    // 鼠标移到托盘中应用程序的图标上时，显示的文本
    tray.setToolTip('TODO List')

    // 点击图标的响应事件，这里是切换主窗口的显示和隐藏
    tray.on('click', () => {
        if(mainWindow.isVisible()){
            mainWindow.hide()
        }else{
            mainWindow.show()
        }
    })

    // 右键点击图标时，出现的菜单，通过Menu.buildFromTemplate定制，这里只包含退出程序的选项。
    tray.on('right-click', () => {
        const menuConfig = Menu.buildFromTemplate([
            {
                label: '退出',
                click: () => app.quit()
            }
        ])
        tray.popUpContextMenu(menuConfig)
    })


    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    //入口文件index.js
    ipcMain.on('mainWindow:close', () => {
        mainWindow.hide()
    })

}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
