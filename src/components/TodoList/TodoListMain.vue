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
                <button class="enable-click" type="submit" @click="saveTodoList">save</button>
            </form>
        </div>
        <div id="content-todo" class="scrollable-container">
            <ul class="enable-click" id="todo-list">
                <li
                   v-for="(item, index) in todoListValues"
                   :key="Math.random()"
                   class="myLi"
                >
                    <div class="dropdown">
                        <!-- TODO前半部分内容 -->
                        <div class="dropdown_top" @click="changeCheckedStatus($event, item)">
                            <label class="element-center">
                                <!-- 复选框 -->
                                <div class="checkbox-wrapper-41">
                                    <input type="checkbox" :checked="checkFinished(item) !== -1">
                                </div>
                                <!-- 文字 -->
                                <span
                                   :class="checkFinished(item) !== -1 ? 'element-center labelSpan text-with-line' : 'element-center labelSpan'"
                                   style="
                                   margin-left: 10px;
                                   word-wrap: break-word;
                                   word-break: normal;
                                   width: 90px;
                                   text-align: left"
                                >{{item.label}}</span>
                            </label>
                            <!-- 详情按钮 -->
                            <button
                                    class="showDetail element-center"
                                    @click="showVal(item)"
                            >
                                <!-- 上箭头 -->
                                <img
                                        style="margin-top: 5px;"
                                        src="../../assets/images/svg/up.svg"
                                        v-if="item.showStatus"
                                >
                                <!-- 下箭头 -->
                                <img
                                        style="margin-top: 5px;"
                                        src="../../assets/images/svg/down.svg"
                                        v-if="!item.showStatus"
                                >
                                <!--                                {{ item.showStatus ? '▲' : '▼' }}-->
                            </button>
                            <!-- 删除按钮 -->
                            <button
                                    class="delete element-center"
                                    @click="deleteTodoSelected($event, item)"
                            >
                            <!-- × -->
                                <!-- 叉号 -->
                                <img
                                        style="margin-top: 2px;"
                                        src="../../assets/images/svg/close.svg"
                                >
                            </button>
                        </div>

                        <!-- 下箭头展开位置 -->
                        <div v-if="item.showStatus" :style="divStyle" class="dropdown_btm card-inner">
                            <!-- 内部的内容区域 -->
                            <!-- 时间选择器（目前不需要时间选择器，默认当天的24点为完成任务的时间） -->
                            <!-- 如果当前的任务已经在完成队列中，则不再计时 -->
                            <div
                               :disabled="getIndexWithList(item.label, this.selectedOption) === -1"
                               class="card-link"
                            >
                                <!-- 时间 -->
                                <img
                                        class="svg"
                                        src="../../assets/images/svg/clock.svg"
                                        @click="showTimeLeast()"
                                >
                                <!-- 备注 -->
                                <img
                                        class="svg"
                                        src="../../assets/images/svg/write.svg"
                                        @click="showRemark()"
                                >


                            </div>

                            <!-- 剩余具体时间 -->
                            <div
                                    v-if="cardShowContent === 'timePicker'"
                                    style="margin-top: 3px;flex: 10;"
                            >
                                任务剩余时间：{{ getTimeRemaining(item.selectedTime) }}
                                <time-picker
                                        :selected-time-now="item.selectedTime"
                                        :time-interval="item.timePickerInterval"
                                        :item-label="item.label"
                                        @getSelectedTime=getSelectedTime
                                />
                            </div>

                            <!-- 具体备注框 -->
                            <textarea
                               v-if="cardShowContent === 'remarkCard'"
                               class="textarea papper"
                               :value="item.remark"
                               @blur="updateItemRemark($event.target.value, item)"
                            ></textarea>
                        </div>

                    </div>
                </li>
            </ul>
        </div>
        <div class="bottom"></div>
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron';
    import TimePicker from "@/components/UtilsComponents/TimePicker";
    import Utils from "../../Utils/common.js";
    export default {
        name: "TodoList",
        components: {
            TimePicker
        },
        data() {
            return {
                // 任务输入input框中的值
                todoInput: '',
                // 用来存储页面上的任务列表数据
                todoListValues: [],
                // 被选中列表的值
                selectedOption: [],
                // 下方区域信息展示
                divStyle: {
                    backgroundColor: '',
                },
                // 方片区域展示内容（默认展示“剩余时间”部分）
                cardShowContent: 'timePicker',
                // 考虑到选择状态也是一次动画，元素晃动也是一次动画，所以只需要监听一次即可
                // 也可能是个bug（后续看看原因）
                time: 1,

                // 数据存储时使用的json文件存储路径
                jsonSavePath: '@/public/jsonSaveData'
            }
        },
        mounted() {
            this.loadTodoList();
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
            // 保存 todoList 任务使用的方法
            saveTodoList(event) {
                // 阻止默认的提交行为，防止因为提交引起的页面刷新行为导致页面数据恢复
                event.preventDefault();

                // 准备要存储的数据
                let jsonSaveData = {
                    todoListValues: this.todoListValues,
                    selectedOption: this.selectedOption
                }

                // 写入数据
                Utils.saveTodoListJsonData(jsonSaveData);
            },
            // 读取当天的 todoList 的内容，并加载
            loadTodoList() {
                // 读取数据
                let readData = Utils.readTodoListNowJsonData();
                this.getChildData(readData);
            },
            // 添加任务项的备注信息
            updateItemRemark(value, item) {
                // 获取下标值
                let indexTmp = this.getIndexWithList(item.label, this.todoListValues);
                if (indexTmp !== -1) {
                    this.todoListValues[indexTmp].remark = value;
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
            changeCheckedStatus(event, item) {
                // 找到最近一个拥有“dropdown”类的元素
                let parentElement = event.target.closest('.dropdown_top');
                if (parentElement) {
                    parentElement.classList.add('clicked');
                    parentElement.addEventListener('animationend', () => {
                        if (this.time === 1) {
                            parentElement.classList.remove('clicked');

                            let indexTmp = this.getIndexWithList(item.label, this.selectedOption);
                            if ( indexTmp > -1) {
                                this.selectedOption.splice(indexTmp, 1);
                            } else {
                                this.selectedOption.push(item);
                            }
                            this.time--;
                        }
                    }, { once: true });
                }

                // 最后重置
                this.time = 1;
            },
            // 展示下拉框部分的内容方法
            showVal(item) {
                // 首先关闭当前已经打开详情区域的任务详情
                for (let i = 0; i < this.todoListValues.length; i++) {
                    if (this.todoListValues[i].showStatus && this.todoListValues[i].label !== item.label) {
                        this.todoListValues[i].showStatus = false;
                    }
                }

                // 然后再执行当前任务详情的打开
                let indexTmp = this.getIndexWithList(item.label, this.todoListValues);
                if (indexTmp !== -1) {
                    this.setRandomColor();
                    this.todoListValues[indexTmp].showStatus = !this.todoListValues[indexTmp].showStatus;
                }
            },
            // 设置颜色
            setRandomColor() {
                const randomColor = Utils.getRandomColor();
                this.divStyle.backgroundColor = randomColor;
            },

            // 页面关闭逻辑
            closeWindow() {
                // 发送消息给 background.js
                ipcRenderer.send('close-window');
            },


            /** 多次使用的方法封装 */
            // 获取任务在对应的列表中的下标的值
            getIndexWithList(label, lists) {
                for (let i = 0; i < lists.length; i++) {
                    if (lists[i].label === label) {
                        return i;
                    }
                }
                return -1;
            },
            // 检查当前任务是否已经完成
            checkFinished(item) {
                return this.getIndexWithList(item.label, this.selectedOption);
            },
            // 从整个任务列表中的元素中删除指定元素
            deleteItemFromTodoListValues(item) {
                let indexTmp = this.getIndexWithList(item.label, this.todoListValues);
                // 移除指定元素
                if (indexTmp !== -1) {
                    this.todoListValues.splice(indexTmp, 1);
                }
            },
            // 从被选中列表中删除指定元素
            deleteItemFromFinished(item) {
                let indexTmp = this.getIndexWithList(item.label, this.selectedOption);
                // 移除指定元素
                if (indexTmp !== -1) {
                    this.selectedOption.splice(indexTmp, 1);
                }
            },
            // 展示备注信息
            showRemark() {
                if (this.cardShowContent !== 'remarkCard') {
                    this.cardShowContent = 'remarkCard';
                } else {
                    this.cardShowContent = 'nothing';
                }
                this.remarkShow = !this.remarkShow;
            },
            // 查看剩余的任务时间
            showTimeLeast() {
                if (this.cardShowContent !== 'timePicker') {
                    this.cardShowContent = 'timePicker';
                } else {
                    this.cardShowContent = 'nothing';
                }
            },


            /** 辅助方法 */
            // 获取当前距离今天24点剩余的时间
            getTimeRemaining(selectedTime) {
                // 计算剩余的毫秒数
                let leastMillis = 0;

                if (!selectedTime) {
                    let now = new Date();
                    let midnight = new Date();
                    midnight.setHours(24, 0, 0, 0); // 设置为今天的 24 点

                    leastMillis = midnight - now;
                } else {
                    leastMillis = this.getMillisecsLeft(selectedTime);
                }

                // 将剩余毫秒数转换为小时和分钟
                let hours = Math.floor(leastMillis / (1000 * 60 * 60));
                let minutes = Math.floor((leastMillis % (1000 * 60 * 60)) / (1000 * 60));

                // 格式化时间为 "小时:分钟" 形式
                let formattedTime = `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}min`;
                return formattedTime;
            },
            getMillisecsLeft(timeStr) {
                // 解析时间字符串
                let [hour, minute, period] = timeStr.split(/:|\s+/);
                // 将小时转换为24小时制
                let adjustedHour = period === 'pm' ? parseInt(hour, 10) + 12 : parseInt(hour, 10);
                // 获取当前时间和目标时间的毫秒差
                let targetTime = new Date();
                targetTime.setHours(adjustedHour);
                targetTime.setMinutes(parseInt(minute, 10));
                targetTime.setSeconds(0);
                targetTime.setMilliseconds(0);
                let millisecsLeft = targetTime.getTime() - Date.now();
                // 返回毫秒差，或者0（如果时间已经过了）
                return millisecsLeft < 0 ? 0 : millisecsLeft;
            },

            // 获取来自子组件的传值
            getChildData(obj) {
                for (let key in obj) {
                    this[key] = obj[key];
                }
            },
            // 时间选择回调方法
            getSelectedTime(obj) {
                let label = obj.label;
                let selectedTime = obj.selectedTime;
                let timePickerInterval = obj.timePickerInterval;

                let tmpIndex = this.getIndexWithList(label, this.todoListValues);
                if (tmpIndex > -1) {
                    this.todoListValues[tmpIndex].selectedTime = selectedTime;
                    this.todoListValues[tmpIndex].timePickerInterval = timePickerInterval;
                }
            }
        }
    }
</script>

<style scoped>
</style>