<template>
    <div>
        <!-- 今日任务 -->
        <TodoListMain class="mainTodoList" v-if="pageSignal === 'today'"/>
        <!-- 历史任务 -->
        <CalendarWithTodoList style="height: 70%; " class="calendarTodoList" v-if="pageSignal === 'history'"/>

        <div class="top-section">
            <div class="left-section">
                <button style="background-color: #ff7f7f" class="enable-click buttonBottom" @click="todayTasks">今日任务</button>
            </div>
            <div class="right-section">
                <button style="background-color: #80ff80" class="enable-click buttonBottom" @click="historyTasks">历史任务</button>
            </div>
        </div>
    </div>
</template>

<script>
    import CalendarWithTodoList from "@/components/CalendarWithTodoList/CalendarWithTodoList";
    import TodoListMain from "@/components/TodoList/TodoListMain";
    export default {
        name: "todoMain",
        data() {
            return {
                pageSignal: 'today'
            }
        },
        components: {
            TodoListMain,
            CalendarWithTodoList
        },
        methods: {
            // 今日任务
            todayTasks() {
                this.pageSignal = 'today';
            },
            // 历史任务
            historyTasks() {
                this.pageSignal = 'history';
            }
        }
    }
</script>

<style scoped>

</style>