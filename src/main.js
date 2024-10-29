import { createApp } from 'vue'
import App from './App.vue'
import "./styles/styles.css"
import "./styles/button.css"
import Utils from "./Utils/common.js";
import DbOperate from "./Utils/dbOperate.js";

// createApp().prototype.$Utils = Utils;
// createApp().prototype.$DbOperate = DbOperate;

// 在 main.js 的顶部
const debug = /--debug/.test(process.argv.slice(2));
if (debug) {
    require('inspector').open(9229, '0.0.0.0', false);
}
// npm run electron:serve -- --debug

createApp(App).mount('#app')


// import { app, BrowserWindow } from 'electron';
// import path from 'path';
// import { initSqlite } from './db/database';
//
// function createWindow() {
//     const win = new BrowserWindow({
//         width: 800,
//         height: 600,
//         webPreferences: {
//             preload: path.join(__dirname, 'renderer.js'),
//             contextIsolation: true,
//             enableRemoteModule: false,
//             nodeIntegration: true,
//         },
//     });
//
//     win.loadFile('index.html');
// }
//
// app.whenReady().then(async () => {
//     try {
//         await initSqlite();
//         createWindow();
//     } catch (err) {
//         console.error("Error during application startup:", err);
//     }
// });
//
//
// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit();
//     }
// });
//
// app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//         createWindow();
//     }
// });
