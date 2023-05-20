import { createApp } from 'vue'
import App from './App.vue'
import "./styles/styles.css"
import Utils from "./Utils/common.js";
import DbOperate from "./Utils/dbOperate.js";

// createApp().prototype.$Utils = Utils;
// createApp().prototype.$DbOperate = DbOperate;


createApp(App).mount('#app')
