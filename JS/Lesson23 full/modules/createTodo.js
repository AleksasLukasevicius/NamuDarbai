const createTodoForm = document.body.querySelector("form#create-todo-form");

createTodoForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const todoTitle = document.querySelector("#todo-title").value.trim();
    const todoCompleted = document.querySelector("#todo-completed").checked;

    const newTodo = {
        title: todoTitle,
        completed: todoCompleted
    };
    console.info({ newTodo });
})
