<template>
    <div>
        <div id="close-button">X</div>
        <div id="todo-container">
            <h1>代办事项</h1>
            <form id="todo-form">
                <input class="enable-click" type="text" id="todo-input" placeholder="Enter a new task">
                <button class="enable-click" type="submit">Add</button>
            </form>
            <ul class="enable-click" id="todo-list"></ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TodoList",
        data() {
            return {}
        },
        mounted() {
            this.initPage();
        },
        methods: {
            initPage() {
                const todoForm = document.getElementById('todo-form');
                const todoInput = document.getElementById('todo-input');
                const todoList = document.getElementById('todo-list');

                todoForm.addEventListener('submit', function (event) {
                    event.preventDefault();
                    const todoText = todoInput.value.trim();
                    if (todoText !== '') {
                        const todoItem = document.createElement('li');
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';

                        const todoLabel = document.createElement('label');
                        todoLabel.textContent = todoText;

                        todoItem.appendChild(checkbox);
                        todoItem.appendChild(todoLabel);
                        todoList.appendChild(todoItem);
                        todoInput.value = '';
                    }
                });
            }
        }
    }
</script>

<style scoped>
</style>