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
                        <div class="dropdown_top" @click="changeCheckedStatus($event)">
                            <label class="element-center">
                                <!-- 复选框 -->
                                <div
                                    class="checkbox"
                                    :id="index"
                                    :value="item.label"
                                    @click="addToSelectedOptions($event, item)"
                                >
                                    <!-- <i :class="selectItemSelectedStatus(item) ? 'finish' : 'square-frame'"></i>-->
                                    {{ checkFinished(item) !== -1 ? '✓' : '□' }}
                                </div>
                                <!-- 文字 -->
                                <span
                                   class="element-center labelSpan"
                                   style="margin-left: 10px; word-wrap: break-word; word-break: normal; width: 120px;"
                                >{{item.label}}</span>
                            </label>

                            <!-- 删除按钮 -->
                            <button
                                    class="delete delete-button element-center"
                                    @click="deleteTodoSelected($event, item)"
                            >
                                ×
                            </button>

                            <button
                                    class="delete delete-button element-center"
                                    @click="showVal(item)"
                            >
                                {{ item.showStatus ? '▲' : '▼' }}
                            </button>
                        </div>

                        <!-- 下箭头展开位置 -->
                        <div v-if="item.showStatus" class="dropdown_btm">
                            <!-- 内部的内容区域 -->
                            <!-- 时间选择器 -->

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
                        this.todoListValues.push({label: todoText, showStatus: false});
                        // 清空输入框中的内容
                        this.todoInput = '';
                    }
                }
            },

            /** 动画部分 */
            // 删除录入的任务内容
            deleteTodoSelected(event, item) {
                // 删除动画
                // 找到最近一个拥有“dropdown”类的元素
                const parentElement = event.target.closest('.dropdown');
                if (parentElement) {
                    parentElement.classList.add('animate-remove');
                    parentElement.addEventListener('animationend', () => {
                        // 删除逻辑
                        this.deleteItemFromTodoListValues(item);
                        this.deleteItemFromFinished(item);
                    }, { once: true });
                }
            },
            // 改变被点击元素的样式
            changeCheckedStatus(event) {
                // 找到最近一个拥有“dropdown”类的元素
                let parentElement = event.target.closest('.dropdown_top');
                if (parentElement) {
                    parentElement.classList.add('clicked');
                    parentElement.addEventListener('animationend', () => {
                        parentElement.classList.remove('clicked');
                    }, { once: true });
                }
            },
            // 选中当前行(将当前行从被选中todoList列表中执行删除或者添加操作)
            addToSelectedOptions(event, item) {
                debugger;
                // 找到需要添加横线或者删除横线的元素
                let clickedElement = event.target;
                let parentElement = clickedElement.parentElement;
                let labelSpan = parentElement.querySelector('.labelSpan');

                if (this.selectedOption.length !== 0) {
                    // 点击的时候，如果原本被选中列表中有当前元素，则删除，没有则添加
                    for (let i = 0; i < this.selectedOption.length; i++) {
                        // 说明当前被选中列表中有当前元素，则移除元素
                        if (this.selectedOption[i].label === item.label) {
                            this.selectedOption.splice(i, 1);

                            // 将当前行元素删除横线属性
                            if (labelSpan) {
                                labelSpan.classList.toggle('text-with-line');
                            }
                            return;
                        }
                    }
                }
                this.selectedOption.push(item);

                // 将当前行元素添加横线属性
                if (labelSpan) {
                    labelSpan.classList.toggle('text-with-line');
                }
            },
            // 展示下拉框部分的内容方法
            showVal(item) {
                for (let i = 0; i < this.todoListValues.length; i++) {
                    if (this.todoListValues[i].label === item.label) {
                        this.todoListValues[i].showStatus = !this.todoListValues[i].showStatus;
                    }
                }
            },


            // 页面关闭逻辑
            closeWindow() {
                // 发送消息给 background.js
                ipcRenderer.send('close-window');
            },


            // 检查当前任务是否已经完成
            checkFinished(item) {
                for (let i = 0; i < this.selectedOption.length; i++) {
                    if (this.selectedOption[i].label === item.label) {
                        // 如果找到了直接返回元素在 selectedOption 中的下标，反之直接返回-1
                        return i;
                    }
                }
                return -1;
            },
            // 从整个任务列表中的元素中删除指定元素
            deleteItemFromTodoListValues(item) {
                for (let i = 0; i < this.todoListValues.length; i++) {
                    if (this.todoListValues[i].label === item.label) {
                        // 移除指定元素
                        this.todoListValues.splice(i, 1);
                    }
                }
            },
            // 从被选中列表中删除指定元素
            deleteItemFromFinished(item) {
                for (let i = 0; i < this.selectedOption.length; i++) {
                    if (this.selectedOption[i].label === item.label) {
                        this.selectedOption.splice(i, 1);
                    }
                }
            }
        }
    }
</script>

<style scoped>
</style>