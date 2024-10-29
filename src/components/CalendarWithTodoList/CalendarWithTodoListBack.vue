<template>
    <div id="calendar" class="enable-click"></div>
</template>

<script>
    import "./cssSource/style.css";
    import calendar from "./jsSource/main";
    import Utils from "@/Utils/common";
    import jsonOperateUtils from "@/Utils/jsonOperateUtils";
    export default {
        name: "CalendarWithTodoList",
        data() {
            return {
                todoData: [
                    {
                        todoDate: '2023-5',
                        todoRecord : [
                            { eventName: 'Lunch Meeting w/ Mark', calendar: 'Work', color: 'orange', date: 20},
                            { eventName: 'Interview - Jr. Web Developer', calendar: 'Work', color: 'orange', date: 20 },
                            { eventName: 'Demo New App to the Board', calendar: 'Work', color: 'orange', date: 22 },
                            { eventName: 'Dinner w/ Marketing', calendar: 'Work', color: 'orange', date: 20 },

                            { eventName: 'Game vs Portalnd', calendar: 'Sports', color: 'blue', date: 21 },
                            { eventName: 'Game vs Houston', calendar: 'Sports', color: 'blue', date: 21 },
                            { eventName: 'Game vs Denver', calendar: 'Sports', color: 'blue', date: 21 },
                            { eventName: 'Game vs San Degio', calendar: 'Sports', color: 'blue', date: 22 },

                            { eventName: 'School Play', calendar: 'Kids', color: 'yellow', date: 20 },
                            { eventName: 'Parent/Teacher Conference', calendar: 'Kids', color: 'yellow', date: 23 },
                            { eventName: 'Pick up from Soccer Practice', calendar: 'Kids', color: 'yellow', date: 24 },
                            { eventName: 'Ice Cream Night', calendar: 'Kids', color: 'yellow', date: 24 },

                            { eventName: 'Free Tamale Night', calendar: 'Other', color: 'green', date: 28 },
                            { eventName: 'Bowling Team', calendar: 'Other', color: 'green', date: 28 },
                            { eventName: 'Teach Kids to Code', calendar: 'Other', color: 'green', date: 26 },
                            { eventName: 'Startup Weekend', calendar: 'Other', color: 'green', date: 25 }
                        ]
                    },
                    {
                        todoDate: '2023-6',
                        todoRecord : [
                            { eventName: 'Lunch Meeting w/ Mark', calendar: 'Work', color: 'orange', date: 20},
                            { eventName: 'Interview - Jr. Web Developer', calendar: 'Work', color: 'orange', date: 20 },
                            { eventName: 'Demo New App to the Board', calendar: 'Work', color: 'orange', date: 22 },
                            { eventName: 'Dinner w/ Marketing', calendar: 'Work', color: 'orange', date: 20 }
                        ]
                    },
                    {
                        todoDate: '2023-4',
                        todoRecord : [
                            { eventName: 'Lunch Meeting w/ Mark', calendar: 'Work', color: 'orange', date: 1},
                            { eventName: 'Interview - Jr. Web Developer', calendar: 'Work', color: 'orange', date: 13 },
                            { eventName: 'Demo New App to the Board', calendar: 'Work', color: 'orange', date: 22 },
                            { eventName: 'Dinner w/ Marketing', calendar: 'Work', color: 'orange', date: 10 }
                        ]
                    },
                    {
                        todoDate: '2023-7',
                        todoRecord : [
                            { eventName: 'Lunch Meeting w/ Mark', calendar: 'Work', color: 'orange', date: 10},
                            { eventName: 'Interview - Jr. Web Developer', calendar: 'Work', color: 'orange', date: 30 },
                            { eventName: 'Demo New App to the Board', calendar: 'Work', color: 'orange', date: 22 },
                            { eventName: 'Dinner w/ Marketing', calendar: 'Work', color: 'orange', date: 2 }
                        ]
                    }
                ],
                todoListSavePath: './public/jsonSaveData/'
            }
        },
        mounted() {
            // 生成加载数据
            this.initCalendarData();
            // 日历初始化方法
            this.calendarInit();
        },
        methods: {
            /**
             * 生成加载数据
             *
             * 目前考虑的todoList数据存储思路：
             * 1、每天的数据会单独生成一个json文件，名称为：2023-5-20_todoList.json 格式，用于存储当天的todo任务列表;
             * 2、第二天将会将数据转移到当月的一个json整体文件中;
             * 3、每个月单独形成一个数据文件（以年为单位存储数据到一个文件夹中）;
             */
            initCalendarData() {
                // 读取json文件，并生成data数据(默认读取当年当月的数据即可，点击上一个月时重新读取数据加载)
                jsonOperateUtils.moveDayJsonToMonthJson();

                // 1、如果今天是每个月的第一天，则直接读取当前的数据记录(_todoList.json文件)
                let currentDate = new Date();
                let currentDay = currentDate.getDate();
                debugger;
                if (currentDay === 1) {
                    this.initCurrentDayTodoData();
                }
                // 2、否则读取当前月对应的_todoLists.json文件的数据 + 当前天的数据记录(_todoList.json文件)
                else {
                    this.initCurrentMonthTodoData();
                }
            },
            // 日历初始化方法
            calendarInit() {
                // 初始化信息为空（data 中的信息其实是示例数据）
                this.todoData = [];
                // 获取当前的年和月的信息
                let currentYearAndMonth = Utils.getYearMonthDay(true);
                // let currentYearAndMonth = '2023-6'
                calendar.calendar('#calendar', this.todoData, currentYearAndMonth);
            },
            // 初始化当前天单文件的数据
            initCurrentDayTodoData() {
                // 获取当前天的文件信息
                let currentDayFilePath = this.todoListSavePath + Utils.getYearMonthDay() + "_todoList.json";
                // 读取文件中的内容
                let currentDayData = jsonOperateUtils.readPackedJsonFile(currentDayFilePath, 'day');
                // 组装最终的参数
                debugger;
                console.log("组装最终的参数！");
                this.todoData = this.mergeInitData(currentDayData);
            },
            // 初始化当前月的数据+当前天的数据(因为实际的设计中，当前月中压缩的数据没有当前天的数据的)
            initCurrentMonthTodoData() {
                let currentDate = new Date();
                // 1、获取当前月的文件信息
                let currentMothFilePath = this.todoListSavePath + (currentDate.getMonth() + 1) + "_todoLists.json";
                // 读取文件中的内容
                let currentMonthData = jsonOperateUtils.readPackedJsonFile(currentMothFilePath, 'month');
                // 2、获取当前天的数据
                let currentDayFilePath = this.todoListSavePath + Utils.getYearMonthDay() + "_todoList.json";
                // 读取文件中的内容
                let currentDayData = jsonOperateUtils.readPackedJsonFile(currentDayFilePath, 'day');
                // 组装处理
                debugger;
                console.log("组装最终的参数！");
                this.todoData = this.mergeInitData(currentDayData, currentMonthData);
            },
            // 将从json文件中读取出来的数据组装成最终的数据
            /**
             * todoData: [
             {
                        todoDate: '2023-5',
                        todoRecord : [
                            { eventName: 'Lunch Meeting w/ Mark', calendar: 'Work', color: 'orange', date: 20}
                            ]}]
             * @param currentDayData
             * @param currentMonthData
             */
            mergeInitData(currentDayData, currentMonthData) {
                // 初始化最终返回的结果的结构体
                let ans = [
                    {
                        todoDate: Utils.getYearMonthDay(true),
                        todoRecord: [
                        ]
                    }
                ];
                // 说明不是第一天的数据
                if (currentMonthData) {
                    debugger;
                    if (currentMonthData && currentMonthData.todoData.length !== 0) {
                        // 将当前天的数据和当前月的数据组装成最终的数据结构并返回
                        ans = currentMonthData.todoData;
                    }
                    // 将今天的数据补充进去
                    let tmpTodoLists = currentDayData.todoListValues;
                    tmpTodoLists.forEach(item => {
                        let tmpTodo = this.initSingleTodo(item.label, 'Work', 'orange', new Date().getDate());
                        ans[0].todoRecord.push(tmpTodo);
                    });
                }
                // 说明是第一天的数据
                else {
                    // 将当前天的数据结构进行组装，组装完成之后进行返回
                    let tmpTodoLists = currentDayData.todoListValues;
                    tmpTodoLists.forEach(item => {
                        let tmpTodo = this.initSingleTodo(item.label, 'Work', 'orange', new Date().getDay());
                        ans[0].todoRecord.push(tmpTodo);
                    });
                }

                return ans;
            },
            // 内部单条todo的生成
            initSingleTodo(eventName, calendar, color, date) {
                return { eventName, calendar, color, date};
            }
        }
    }
</script>

<style scoped>

</style>