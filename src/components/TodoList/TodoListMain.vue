<template>
    <div>
        <div class="content-header">
            <h2>代办事项</h2>
            <button id="close-button" class="enable-click" @click="closeWindow">×</button>
        </div>
        <div class="content-input">
            <form id="todo-form">
                <input class="enable-click" type="text" id="todo-input" placeholder="Enter a new task" v-model="todoInput">
                <button class="enable-click" type="submit" @click="addTodoList">ADD</button>
            </form>
        </div>
        <div id="content-todo">
            <ul class="enable-click" id="todo-list">
                <li
                   v-for="(item, index) in todoListValues"
                   :key="Math.random()"
                >
                    <div class="dropdown">
                        <!-- TODO前半部分内容 -->
                        <div class="dropdown_top">
                            <!-- 复选框 -->
                            <input
                                    class="todoInput"
                                    type="checkbox"
                                    :id="index"
                                    :value="item.label"
                                    v-model="selectedOption"
                            >

                            <!-- 文字 -->
                            <label>
                                {{item.label}}
                            </label>

                            <!-- 删除按钮 -->
                            <button
                                    class="delete delete-button"
                                    @click="deleteTodoSelected(item.label)"
                            >
                                删除
                            </button>

                            <button
                                    class="delete delete-button"
                                    @click="showVal()"
                            >
                                展示
                            </button>
                        </div>

                        <!-- 下箭头展开位置 -->
                        <div class="dropdown_btm">
                            <!-- 内部的内容区域 -->
                        </div>
                    </div>



                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron';
    export default {
        name: "TodoList",
        data() {
            return {
                // 任务输入input框中的值
                todoInput: '',
                // 用来存储页面上的任务列表数据
                todoListValues: [],
                // 被选中列表的值
                selectedOption: []
            }
        },
        mounted() {
            this.initPage();
        },
        watch: {
            // todoListValues: {
            //     handler(oldVal, newVal) {
            //         console.error("----------------");
            //         console.error(oldVal);
            //         console.error(newVal);
            //         console.error("----------------");
            //     },
            //     deep: true
            // }
        },
        methods: {
            initPage() {
            },
            // 新增 todoList 任务的时候使用的方法
            addTodoList(event) {
                // 阻止默认的提交行为，防止因为提交引起的页面刷新行为导致页面数据恢复
                event.preventDefault();

                // 获取任务输入框中的内容
                let todoText = this.todoInput.trim();
                // 如果输入了内容，则将内容加入到 todoListValues 中，并在页面进行渲染
                if (todoText !== '') {
                    // 检查当前任务是否已经录入过了，如果录入过了不重复记录
                    let checkList = this.todoListValues.filter(item=>{
                        if (item.label === todoText) {
                            return item;
                        }
                    });

                    if (checkList.length === 0) {
                        // 将数据加入到 todoListValues 中
                        this.todoListValues.push({label: todoText});
                        // 清空输入框中的内容
                        this.todoInput = '';
                    }
                }
            },
            // 删除录入的任务内容
            deleteTodoSelected(label) {
                this.todoListValues = this.todoListValues.filter(item => {
                    if (item.label !== label) {
                        return item;
                    }
                })
            },
            // 展示下拉框部分的内容方法
            showVal() {
                // if ($(".dropdown_btm").hasClass("open")) {
                //     $(".dropdown_btm").removeClass("open");
                //     $(".dropdown_btm").addClass("close");
                // }
                //
                // else if ($(".dropdown_btm").hasClass("close")) {
                //     $(".dropdown_btm").removeClass("close");
                //     $(".dropdown_btm").addClass("open");
                // }
            },
            // 页面关闭逻辑
            closeWindow() {
                // 发送消息给 background.js
                ipcRenderer.send('close-window');
            }
        }
    }
</script>

<style scoped>
</style>