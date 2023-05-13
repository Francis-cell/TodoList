<template>
    <div>
        <button id="close-button" class="enable-click" @click="closeWindow">×</button>
        <div id="todo-container">
            <h1>代办事项</h1>
            <form id="todo-form">
                <input class="enable-click" type="text" id="todo-input" placeholder="Enter a new task">
                <button class="enable-click" type="submit">新增</button>
            </form>
            <ul class="enable-click" id="todo-list">
                <li
                   v-for="(item, index) in todoListValues"
                   :key="Math.random()"
                >
                    <input
                        type="checkbox"
                        :id="index"
                        :value="item.label"
                        v-model="selectedOption"
                    >
                    <label> {{item.label}} </label>
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
                // 用来存储页面上的任务列表数据
                todoListValues: [],
                // 被选中列表的值
                selectedOption: []
            }
        },
        mounted() {
            this.initPage();
        },
        methods: {
            initPage() {
                // 新增任务方法初始化
                this.addTodoList();
            },
            // 新增 todoList 任务的时候使用的方法
            addTodoList() {
                const todoForm = document.getElementById('todo-form');
                const todoInput = document.getElementById('todo-input');

                // 点击新增的时候，给 todoListValues 中添加数据记录
                todoForm.addEventListener('submit',  (event)=> {
                    event.preventDefault();
                    // 获取任务输入框中是否输入数据
                    const todoText = todoInput.value.trim();
                    // 如果输入了内容，则将内容加入到 todoListValues 中，并在页面进行渲染
                    if (todoText !== '') {
                        debugger;
                        // 将数据加入到 todoListValues 中
                        this.todoListValues.push({label: todoText});
                    }
                });
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