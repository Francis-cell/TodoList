// import sqlite3 from 'sqlite3';
// // 引入日志
// import logger from "../config/electron/ElectronLog";
//
// // 默认TodoList存储数据的路径
// const todoListDBPath = "../../public/SqlLiteData/todoListData.db";
//
// export default {
//     // SQL Lite 数据存储，打开数据库链接
//     connectToDB(DBPath) {
//         // 打开现有的SQL Lite数据库文件
//         const db = new sqlite3.Database(DBPath);
//         return db;
//     },
//     // 关闭数据库链接
//     closeConnectToDB(DB) {
//         // 关闭数据库链接
//         DB.close((err) => {
//             if (err) {
//                 logger.error("关闭数据库链接 " + DB + " 失败啦！失败信息为：" + err);
//                 console.error("关闭数据库链接 " + DB + " 失败啦！失败信息为：", err);
//             } else {
//                 logger.info("关闭数据库链接 "  + DB + " 成功！");
//                 console.log("关闭数据库链接 "  + DB + " 成功！");
//             }
//         })
//     },
//     // 返回TodoList数据库文件
//     connectToDoListDB() {
//         return this.connectToDB(todoListDBPath);
//     },
//     /**
//      * select操作
//      * @param DB 被操作的数据库
//      * @param table 被操作的表格
//      * @param sql select语句
//      *
//      * 示例： SELECT * FROM users;
//      */
//     selectValueForDB(DB, table, sql) {
//         DB.all((sql), (err, rows) => {
//             if (err) {
//                 logger.error("查询数据库 " + DB + " 的 " + table  + " 表出错啦！错误信息为：" + err);
//                 console.error("查询数据库 " + DB + " 的 " + table  + " 表出错啦！错误信息为：", err);
//             } else {
//                 // 处理查询结果
//                 return rows;
//             }
//         });
//     },
//     /**
//      * update操作
//      * @param DB 被操作数据库
//      * @param table 被操作表格
//      * @param sql update语句
//      * @param conditionalArr   update sql语句中条件数组
//      *
//      * 示例： sql = UPDATE users SET age = ? WHERE name = ?;
//      *       conditionalArr = [30, 'Alice'];
//      */
//     updateValueForDB(DB, table, sql, conditionalArr) {
//         DB.run(sql, conditionalArr, (err) => {
//             if (err) {
//                 logger.error("修改 " + DB + " 中的 " + table + " 的时候失败啦！失败信息为：" + err);
//                 console.error("修改 " + DB + " 中的 " + table + " 的时候失败啦！失败信息为：", err);
//             } else {
//                 logger.info("修改 " + DB + " 中的 " + table + " 成功！");
//                 console.log("修改 " + DB + " 中的 " + table + " 成功！");
//             }
//         });
//     },
//     /**
//      * delete操作
//      * @param DB 被操作数据库
//      * @param table 被操作表格
//      * @param sql delete语句
//      * @param conditionalArr   delete sql语句中条件数组
//      *
//      * 示例： sql = DELETE FROM users WHERE name = ?;
//      *       conditionalArr = ['Alice'];
//      */
//     deleteValueForDB(DB, table, sql, conditionalArr) {
//         DB.run(sql, conditionalArr, (err) => {
//             if (err) {
//                 logger.error("删除 " + DB + " 中的 " + table + " 的时候失败啦！失败信息为：" + err);
//                 console.error("删除 " + DB + " 中的 " + table + " 的时候失败啦！失败信息为：", err);
//             } else {
//                 logger.info("删除 " + DB + " 中的 " + table + " 成功！");
//                 console.log("删除 " + DB + " 中的 " + table + " 成功！");
//             }
//         });
//     },
//     // 数据库压缩操作
//     compressDB(DB) {
//         DB.run('VACUUM', (err) => {
//            if (err) {
//                logger.error("压缩 " + DB + " 失败啦！失败信息为：" + err);
//                console.error("压缩 " + DB + " 失败啦！失败信息为：", err);
//            } else {
//                logger.info("数据库 " + DB + " 压缩完成！");
//                console.log("数据库 " + DB + " 压缩完成！");
//            }
//         });
//     },
//     // TODO 数据归档操作(后续需要使用到数据归档的时候再用)
//     archiveData() {
//         let intervalInMilliseconds = 100000;
//         // 在指定时间间隔执行数据归档操作
//         setInterval(() => {
//             // 执行数据归档的逻辑，将不再需要的数据归档到单独的数据库文件中
//             // 并从主数据库文件中删除归档的数据
//         }, intervalInMilliseconds);
//     }
// }