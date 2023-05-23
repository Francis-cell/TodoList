<template>
    <div id="calendar" class="enable-click"></div>
</template>

<script>
    import "./cssSource/style.css";
    import calendar from "./jsSource/main";
    import Utils from "@/Utils/common";
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
                jsonData:
                    {
                        "2023-05-20": [
                            {"eventName" : "XXX", "calendar": "Work", "color": "orange"},
                            {"eventName" : "XXX", "calendar": "Work", "color": "blue"},
                            {"eventName" : "XXX", "calendar": "Work", "color": "green"}
                        ],
                        "2023-05-21": [
                            {"eventName" : "XXX", "calendar": "Work", "color": "orange"},
                            {"eventName" : "XXX", "calendar": "Work", "color": "blue"},
                            {"eventName" : "XXX", "calendar": "Work", "color": "green"}
                        ]
                    }
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
             * 数据格式要求
             * {
             *      "2023-05-20": [
             *           {"eventName" : "XXX", "calendar": "Work", "color": "orange"},
             *           {"eventName" : "XXX", "calendar": "Work", "color": "blue"},
             *           {"eventName" : "XXX", "calendar": "Work", "color": "green"}
             *      ],
             *      "2023-05-21": [
             *           {"eventName" : "XXX", "calendar": "Work", "color": "orange"},
             *           {"eventName" : "XXX", "calendar": "Work", "color": "blue"},
             *           {"eventName" : "XXX", "calendar": "Work", "color": "green"}
             *      ]
             * }
             *
             */
            initCalendarData() {
                // 读取json文件，并生成data数据
                // this.todoData = this.jsonData;
            },
            // 日历初始化方法
            calendarInit() {
                // 获取当前的年和月的信息
                let currentYearAndMonth = Utils.getYearMonthDay(true);
                // let currentYearAndMonth = '2023-6'

                calendar.calendar('#calendar', this.todoData, currentYearAndMonth);
            }
        }
    }
</script>

<style scoped>

</style>