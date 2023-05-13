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
