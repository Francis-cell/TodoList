<template>
    <div class="timePicker">
        <div class="timePicker-inner">
<!--            <select id="timeSelect" @change="selectTime">-->
<!--                <option v-for="time in times" :value="time">-->
<!--                    {{ time }}-->
<!--                </option>-->
<!--            </select>-->

            <div class="dropdown">
                <div class="dropdown__selected" @click="selectTimeStart" >
                    {{selectedTime}}
                </div>
                <div class="dropdown__panel" v-if="showDropdown">
                    <div v-for="time in times" :value="time" class="dropdown__option" @click="selectTimeEnd(time)">
                        {{time}}
                    </div>
                </div>
            </div>
        </div>

        <div>
            <input id="timeInterval" v-model="timePickerInterval" type="number" min="1" max="60" @change="updateTimes" /> 分钟
        </div>
    </div>
</template>

<script>
    export default {
        name: 'TimePicker',
        props: {
            itemLabel: {
                type: String,
                default: '',
                description: '当前任务的label描述'
            },
            selectedTimeNow: {
                type: String,
                default: '',
                description: '当前任务的选择的任务结束时间'
            },
            timeInterval: {
                type: String,
                default: '',
                description: '时间粒度'
            },
        },
        data() {
            return {
                showDropdown: false,
                selectedTime: '2:00 pm',
                // 时间粒度
                timePickerInterval: '30',
                times: [],
            };
        },
        watch: {
            selectedTime: {
                handler(val) {
                    this.$emit('getSelectedTime',
                        {
                            selectedTime: val,
                            label: this.itemLabel,
                            timePickerInterval: this.timePickerInterval
                        });
                }
            }
        },
        mounted() {
            // 1、设置初始化选择的任务结束时间点
            if (this.selectedTimeNow === '') {
                // 获取当前的时间
                let now = new Date();
                // 将剩余毫秒数转换为小时和分钟
                let hours = now.getHours();
                let minutes = now.getMinutes();
                this.selectedTime = hours <= 12 ? (hours + ':' + (minutes > 10 ? minutes : ('0' + minutes)) + ' am') :
                    ((hours - 12) + ':' + (minutes > 10 ? minutes : ('0' + minutes)) + ' pm');
            } else {
                this.selectedTime = this.selectedTimeNow;
            }

            // 2、设置初始化的时间粒度
            if (this.timeInterval === '') {
                this.timePickerInterval = '30';
            } else {
                this.timePickerInterval = this.timeInterval;
            }

            // 3、更新时间下拉框
            this.updateTimes();
        },
        methods: {
            selectTimeStart() {
                debugger;
                this.showDropdown = !this.showDropdown;
            },
            selectTimeEnd(time) {
                this.selectedTime = time;
                this.showDropdown = false;
            },
            updateTimes() {
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();

                this.times = [];
                for (let i = currentHour; i < 24; i++) {
                    for (let j = 0; j < 60; j += this.timePickerInterval) {
                        if (i === currentHour && j < currentMinute) {
                            continue; // Skip past time
                        }

                        const hours = i % 12 || 12;
                        const minutes = ('0' + j).slice(-2);
                        const ampm = i < 12 ? ' am' : ' pm';

                        this.times.push(`${hours}:${minutes}${ampm}`);
                    }
                }
            }
        },
    };
</script>

<style>
    .timePicker {
        display: flex;
        width: 250px;
        height: 100px;
        margin-top: 5px;
    }

    .timePicker-inner {
        display:flex;
        flex-direction: column;
        padding: 0 10px;
    }

    #timeInterval {
        border-color: white;
        padding: 5px 5px;
        width: 30px;
        border-radius: 5px;
    }

    /** 隐藏number的input框后的上下箭头 */
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type=number] {
        -moz-appearance:textfield;
    }

    /** 时间选择器样式 */
    .dropdown__selected {
        width: 100px;
        background: #ffffff;
        border-radius:5px;
        padding: 7px 0 5px 10px;
    }

    .dropdown__panel {
        max-height: 70px;
        height: 70px;
        background: #FFFFFF;
        overflow-y: auto;
        border-radius: 5px;
    }

    /* 自定义滚动条样式 */
    .dropdown__panel::-webkit-scrollbar {
        width: 8px; /* 设置滚动条宽度 */
    }

    .dropdown__panel::-webkit-scrollbar-track {
        background-color: #f5f5f5; /* 设置滚动条轨道背景颜色 */
    }

    .dropdown__panel::-webkit-scrollbar-thumb {
        background-color: #888; /* 设置滚动条滑块颜色 */
        border-radius: 4px; /* 设置滚动条滑块圆角 */
    }

    .dropdown__panel::-webkit-scrollbar-thumb:hover {
        background-color: #555; /* 设置滚动条滑块悬停时颜色 */
    }

    .dropdown__option:hover {
        background: #8acce2;
    }
</style>
