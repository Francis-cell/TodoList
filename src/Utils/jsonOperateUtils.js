import { pack, unpack } from 'jsonpack';
const fs = require('fs');
const path = require('path');
const todoListSavePath = "./public/jsonSaveData/";
import Utils from "./common.js";

export default {
    /**
     * 转移当前尚未被删除的json文件到对应月份中的json文件中并进行存储
     *
     * 数据存储格式：
     * todoData: [
     *      {
                    todoDate: '2023-6',
                    todoRecord : [
                        { eventName: 'Lunch Meeting w/ Mark', calendar: 'Work', color: 'orange', date: 20},
                        { eventName: 'Interview - Jr. Web Developer', calendar: 'Work', color: 'orange', date: 20 },
                        { eventName: 'Demo New App to the Board', calendar: 'Work', color: 'orange', date: 22 },
                        { eventName: 'Dinner w/ Marketing', calendar: 'Work', color: 'orange', date: 20 }
                    ]
            }
     * ]
     */
    moveDayJsonToMonthJson() {
        debugger;
        // 1、遍历指定路径下存在的名字为 2023-5-20_todoList.json 格式的文件
        // ①、声明一个临时的map集合，用来存储这些仍然没有被转移到指定月份json文件的json文件名
        let tmpDayJsonFileMap = new Map();

        // ②、读取指定路径文件夹下的所有文件
        fs.readdirSync(todoListSavePath).forEach(file => {
            // 获取到文件名
            if (file.endsWith("_todoList.json")) {
                // 提取日期信息
                let dateStr = file.substring(0, file.indexOf("_"));

                // 获取到日期信息中的月份信息，用来将文件转移到指定的月份json文件中
                let date = new Date(dateStr);
                // 获取月份信息
                let month = date.getMonth() + 1;

                // 将文件名存储到map中指定的月份key下
                if (tmpDayJsonFileMap.has(month)) {
                    tmpDayJsonFileMap.get(month).push(file);
                } else {
                    tmpDayJsonFileMap.set(month, [file]);
                }

            }
        });

        // 获取当天的日期信息
        const today = new Date();
        const todayDateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

        // 2、依次将 tmpDayJsonFileMap 中的json文件转移到对应的月份json文件中去
        tmpDayJsonFileMap.forEach((files, month) => {

            // ①、生成月文件的路径
            let monthFilePath = path.join(todoListSavePath, `${month}_todoLists.json`);

            // ②、初始化月份数据
            let monthData = { todoData: [] };

            // ③、判断月份信息是否存在，存在则读取数据
            if (fs.existsSync(monthFilePath)) {
                // 读取到月份json文件中已经存储的数据
                // 注意这里unpack的时候，里面的内容不能是buffer类型的，而应该时String类型的
                monthData = unpack(fs.readFileSync(monthFilePath).toString());
            } else {
                // 否则创建一个空的月份todoList文件
                Utils.saveJsonData(monthData, monthFilePath);
            }

            // ④、处理每一个_todoList.json文件
            files.forEach(file => {
                // 判断是否为执行方法当日的文件，如果是则不处理
                if (file.startsWith(todayDateStr)) {
                    return;
                }


                // 拼接文件路径
                let filePath = path.join(todoListSavePath, file);
                // 获取到被读取文件中的内容
                let fileData = unpack(fs.readFileSync(filePath, 'utf8'));


                // 解析文件数据(解析回初始的数据样式)
                let todoListValues = fileData.todoListValues;
                let selectedOption = fileData.selectedOption;

                // 提取日期信息
                let dateStr = file.substring(0, file.indexOf("_"));
                let date = new Date(dateStr);
                let day = date.getDate();

                // 组装每天的数据
                let dayData = {
                    todoDate: `${date.getFullYear()}-${date.getMonth() + 1}`,
                    todoRecord: todoListValues.map(label => ({
                        eventName: label,
                        calendar: 'Work',
                        color: this.getRandomColor(),
                        date: day
                    }))
                }

                // 将每天的数据追加到当月数据中
                monthData.todoData.push(dayData);

                // 删除已经追加完毕的_todoList.json文件
                fs.unlinkSync(filePath);
            });
        });
    },
    // 如果被读取的文件中有内容，则返回压缩的json内容，否则新建这个文件
    // fileType支持两种类型，一种是month,一种是day
    readPackedJsonFile(filePath, fileType) {
        if (fs.existsSync(filePath)) {
            // 读取到月份json文件中已经存储的数据
            // 注意这里unpack的时候，里面的内容不能是buffer类型的，而应该时String类型的
            return unpack(fs.readFileSync(filePath).toString());
        }
        // 否则创建一个空的月份todoList文件
        else {
            let tmpData;
            // 如果是月份文件
            if (fileType === 'month') {
                tmpData = { todoData: [] };
            } else {
                tmpData = { todoListValues: [] };
            }
            Utils.saveJsonData(tmpData, filePath);
        }
    },

    // 生成随机颜色
    getRandomColor() {
        const colors = ['orange', 'yellow', 'blue', 'green'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }
}