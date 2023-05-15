<template>
  <!-- 引入主组件 -->
<!--  <TodoList />-->
  <TodoMain />
</template>

<script>
// import TodoList from './components/TodoList/TodoListMain.vue'
import TodoMain from "@/views/todoMain/todoMain";
export default {
  name: 'App',
  components: {
    // TodoList,
    TodoMain
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
