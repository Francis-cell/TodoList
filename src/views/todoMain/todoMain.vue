<template>
    <!-- 今日任务 -->
    <TodoListMain />
    <!-- 历史任务 -->
    <div ></div>

    <div class="task-container">
        <div class="top-section">
            <div class="left-section">
                <h3>今日任务</h3>
            </div>
            <div class="right-section">
                <h3>历史任务</h3>
            </div>
        </div>
    </div>

</template>

<script>
    import TodoListMain from "@/components/TodoList/TodoListMain";
    export default {
        name: "todoMain",
        components: {
            TodoListMain
        }
    }
</script>

<style scoped>

</style>