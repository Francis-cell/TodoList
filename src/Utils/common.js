import { pack, unpack } from 'jsonpack';
const fs = require('fs');
const todoListSavePath = "./public/jsonSaveData";

export default {
    // 判断一个元素的数据类型
    typeOf(obj) {
        let res = Object.prototype.toString.call(obj).split(' ')[1];
        res = res.substring(0, res.length - 1).toLowerCase();
        return res;
    },
    // 生成一个随机下标
    getRandomIndex(list) {
        return Math.floor(Math.random() * list.length);
    },
    // 随机颜色生成方法
    getRandomColor() {
        // 生成随机颜色值
        // const letters = '0123456789ABCDEF';
        // let color = '#';
        // for (let i = 0; i < 6; i++) {
        //     color += letters[Math.floor(Math.random() * 16)];
        // }

        // 颜色列表
        let colorList = ['F5F0BB', 'DBDFAA', 'B3C890', 'F6C391', 'D4ADFC', 'ECCDB4', 'E76161', 'FFE6C7', 'FFB4B4',
            'B0DAFF', 'FDF4F5', 'E8A0BF', 'A9907E', 'D5B4B4', 'F6F1F1', '8D7B68', 'A4907C', 'C8B6A6', 'F1DEC9',
            'F5EAEA', 'FFB84C', 'F16767', 'B9F3E4', 'FFD4D4', 'FFFBAC', 'FFB26B', '5BC0F8', '86E5FF', 'FFC6D3',
            'FEA1BF', 'E98EAD', 'DFD3C3', 'DFD3C3', 'D0B8A8', 'DFF6FF']

        let randomIndex = this.getRandomIndex(colorList);
        return '#' + colorList[randomIndex];
    },
    /**
     * 获取当前的年-月-日时间
     * @param withOutDay 是否携带日期的信息，默认不携带 (可配置true值使得它不携带这个参数)
     * @returns {string}
     */
    getYearMonthDay(withOutDay) {
        let currentDate = new Date();
        // 获取当前的年信息
        let currentYear = currentDate.getFullYear();
        // 获取当前的月份信息
        let currentMonth = currentDate.getMonth() + 1;
        // 获取当前的日期信息
        let currentDay = currentDate.getDate();

        if (withOutDay) {
            return currentYear + "-" + currentMonth;
        } else {
            return currentYear + "-" + currentMonth + "-" + currentDay;
        }
    },
    // 查看一个路径的末尾是否引入了"/"，【不包含文件名称的路径】(如果有则返回true，反之返回false)
    checkLastSignString(pathWithOutFileName) {
        // 正则校验
        let endsWithSlash = /\/$/.test(pathWithOutFileName);
        return endsWithSlash;
    },
    /**
     * 查看一个文件路径下的文件是否存在，如果不存在则创建这个文件
     * @param filePath 被检查文件的路径
     * @param data 如果为空文件，创建使用的数据
     */
    checkFileExist(filePath, data) {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            // 说明被检查的路径的文件不存在
            if (err) {
                // 先保存一个空的文件
                this.saveTodoListJsonData(data);
                return false;
            } else {
                // 文件已经存在
                return true;
            }
        });
    },
    /**
     * 生成保存或者读取的时候的文件的路径
     * @param dayInfo 传入的日期信息
     * @param type 要保存的文件的类型 eg: todoList类型
     * @returns {string}
     */
    getJsonFileName(dayInfo, type) {
        return dayInfo + "_" + type + ".json";
    },
    /**
     * JSON数据存储
     * @param  要进行保存的数据，首先需要对data数据进行JSON验证
     * @param path 最终保存的文件的路径
     */
    saveJsonData(data, path) {
        // 先将JSON文件进行压缩处理
        let compressedData = pack(data);
        // 将压缩后的JSON文件进行存储
        fs.writeFileSync(path, compressedData);
    },
    /**
     * 保存todoList中的数据
     * @param data 需要进行保存的JSON数据信息
     */
    saveTodoListJsonData(data) {
        debugger;
        // 首先获取当天的"年-月-日"信息
        let dayNow = this.getYearMonthDay();

        // 生成当天要保存的文件的名称
        let fileSaveName = this.getJsonFileName(dayNow, 'todoList');

        // 组装被获取的文件的(完整)路径【包括文件的路径 + 文件的名称】
        let wholeFilePath = "";
        if (this.checkLastSignString(todoListSavePath)) {
            wholeFilePath = todoListSavePath + fileSaveName;
        } else {
            wholeFilePath = todoListSavePath + "/" + fileSaveName;
        }

        // 保存到指定的路径下
        this.saveJsonData(data, wholeFilePath);
    },
    /**
     * 读取JSON文件中的信息
     * @param withFileNamePath 将要被读取的JSON文件的完整路径（携带文件的名称）
     * @param data 如果初始检查json文件不存在，则使用data中的数据初始化这个json文件
     */
    readJsonData(withFileNamePath, data) {
        // TODO 如果没有这个文件，则先创建文件
        this.checkFileExist(withFileNamePath, data);

        // 读取指定路径下的被压缩的JSON文件的内容(默认采用utf-8格式进行数据的存储和解析)
        let compressedData = fs.readFileSync(withFileNamePath, 'utf-8');
        // 将被压缩的JSON文件进行解压
        return unpack(compressedData);
    },
    /**
     * 读取todoList指定路径的文件内容
     * @param dayInfo 指定日期信息 (要求格式为 2023-5-20 的格式类型)
     * @param fileName 也可以直接指定文件的名称打开
     * @param data 当数据为空的时候，传入的用于初始化json文件的数据
     *
     * eg: readTodoListJsonData(false, JSON文件名称)
     *     readTodoListJsonData(dayInfo)
     */
    readTodoListJsonData(dayInfo, fileName, data) {
        let tmpFileName = "";
        if (dayInfo) {
            // 形成文件存储时的名称
            tmpFileName = this.getJsonFileName(dayInfo, 'todoList');
        } else {
            tmpFileName = fileName;
        }

        // 组装被获取的文件的(完整)路径【包括文件的路径 + 文件的名称】
        let wholeFilePath = "";
        if (this.checkLastSignString(todoListSavePath)) {
            wholeFilePath = todoListSavePath + tmpFileName;
        } else {
            wholeFilePath = todoListSavePath + "/" + tmpFileName;
        }



        return this.readJsonData(wholeFilePath, data);
    },
    // 获取当天的todoList信息
    readTodoListNowJsonData(data) {
        // 获取当天的信息
        let dayNow = this.getYearMonthDay();
        // 读取todoList指定位置的json数据
        return this.readTodoListJsonData(dayNow, '' ,data);
    },

    // 深拷贝一个对象的值
    deepCopy(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }

        let copy = Array.isArray(obj) ? [] : {};

        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                copy[key] = this.deepCopy(obj[key]);
            }
        }

        return copy;
    }
}
