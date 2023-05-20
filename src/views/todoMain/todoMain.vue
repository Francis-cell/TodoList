<template>
<!--    &lt;!&ndash; 今日任务 &ndash;&gt;-->
<!--    <TodoListMain />-->
<!--    &lt;!&ndash; 历史任务 &ndash;&gt;-->
<!--    <div ></div>-->

<!--    <div class="task-container">-->
<!--        <div class="top-section">-->
<!--            <div class="left-section">-->
<!--                <h3>今日任务</h3>-->
<!--            </div>-->
<!--            <div class="right-section">-->
<!--                <h3>历史任务</h3>-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->

    <CalendarWithTodoList/>

</template>

<script>
    import CalendarWithTodoList from "@/components/CalendarWithTodoList/CalendarWithTodoList";
    import TodoListMain from "@/components/TodoList/TodoListMain";
    export default {
        name: "todoMain",
        components: {
            TodoListMain,
            CalendarWithTodoList
        }
    }
</script>

<style scoped>

</style>