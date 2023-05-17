<template>
    <div>
        <div class="content-header">
            <h2>代办事项</h2>
            <button id="close-button" class="enable-click" @click="closeWindow">×</button>
        </div>
        <div class="content-input">
            <form id="todo-form">
<!--                &lt;!&ndash; 编辑 &ndash;&gt;-->
<!--                <img-->
<!--                        class="svg"-->
<!--                        src="../../assets/images/svg/edit.svg"-->
<!--                >-->
                <input class="enable-click" type="text" id="todo-input" placeholder="Enter a new task" v-model="todoInput">
                <button class="enable-click" type="submit" @click="addTodoList">ADD</button>
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
                                    v-if="timeShow"
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
                               v-if="remarkShow"
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
                // 备注信息的展示情况
                remarkShow: false,
                // 剩余任务时间展示情况
                timeShow: false,
                // 考虑到选择状态也是一次动画，元素晃动也是一次动画，所以只需要监听一次即可
                // 也可能是个bug（后续看看原因）
                time: 1
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
                this.remarkShow = !this.remarkShow;
            },
            // 查看剩余的任务时间
            showTimeLeast() {
                this.timeShow = !this.timeShow;
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
            // 设置颜色
            setRandomColor() {
                const randomColor = this.getRandomColor();
                this.divStyle.backgroundColor = randomColor;
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