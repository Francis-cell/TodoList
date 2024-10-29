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
