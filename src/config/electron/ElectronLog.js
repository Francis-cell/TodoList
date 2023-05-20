// .ElectronLog.js

import log from 'electron-log'
const path = require('path');
const logPath = "../../../public/logs";


log.transports.file.level = 'debug'
log.transports.file.maxSize = 1002430 // 10M
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
// ====重新定义日志输入的文件位置以及文件名====start
const currentDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
const fileName = `${currentDate}.log`
const basePath = path.join(logPath, 'electron_log', fileName)
log.transports.file.resolvePath = () => basePath
// ====重新定义日志输入的文件位置以及文件名====end

export default {
    info (param) {
        log.info(param)
    },
    warn (param) {
        log.warn(param)
    },
    error (param) {
        log.error(param)
    },
    debug (param) {
        log.debug(param)
    },
    verbose (param) {
        log.verbose(param)
    },
    silly (param) {
        log.silly(param)
    }
}


