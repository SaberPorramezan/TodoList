// selectors
const todoInput = document.querySelector(".todo-input");
const addTodoBtn = document.querySelector(".todo-btn");
const todoList = document.querySelector(".todo-list");
const filterTodo = document.querySelector(".filter-todo");
const clearBtn = document.querySelector(".clear-input");
const notFound = document.querySelector(".not-found");

document.addEventListener("DOMContentLoaded", getTodos);

// event Listener
addTodoBtn.addEventListener("click", addTodo);
todoList.addEventListener("click", todoOptions);
filterTodo.addEventListener("click", filters);
clearBtn.addEventListener("click", clearInput);
// event Functions
function addTodo(e) {
  e.preventDefault();
  if (todoInput.value.length) {
    if (!todoInput.classList.contains("edit")) {
      if (todoInput.value.length >= 0) {
        let todoId = localStorage.getItem("todos")
          ? JSON.parse(localStorage.getItem("todos"))
          : [];
        const todoDive = document.createElement("div");
        todoDive.classList.add("todo");
        const newTodo = `<li id=${todoId.length}>${todoInput.value}</li>
            <span><i class="far fa-check-square"></i></span>
            <span><i class="far fa-edit"></i></span>
            <span><i class="far fa-trash-alt"></i></span>`;
        todoDive.innerHTML = newTodo;
        todoList.appendChild(todoDive);
        setTodos(todoId.length, todoInput.value);
        todoInput.value = "";
      } else {
        alert("چیزی وارد نشده است !");
      }
    } else {
      const todoLists = [...todoList.childNodes];
      let edit = localStorage.getItem("edit")
        ? JSON.parse(localStorage.getItem("edit"))
        : [];
      let todos = localStorage.getItem("todos")
        ? JSON.parse(localStorage.getItem("todos"))
        : [];
      todos.filter((t) => {
        if (t.id == edit[0].id) {
          t.value = todoInput.value;
        }
      });
      localStorage.setItem("todos", JSON.stringify(todos));
      todoLists.forEach((todo) => {
        if (todo.children[0].id == edit[0].id) {
          todo.children[0].innerHTML = todoInput.value;
        }
      });
      todoInput.value = "";
      todoInput.classList.remove("edit");
      clearBtn.style.display = "none";
    }
  } else {
    alert("چیزی وارد نشده است !");
  }
}
function todoOptions(e) {
  const classList = [...e.target.classList];
  const items = e.target;
  const todo = items.parentElement.parentElement;
  if (classList[1] === "fa-check-square") {
    if (!todoInput.classList.contains("edit")) {
      todo.classList.toggle("completed");
      updateTodos(todo);
    }
  } else if (classList[1] === "fa-trash-alt") {
    removeTodos(todo);
    todo.remove();
  } else if (classList[1] === "fa-edit") {
    if (!todo.children[0].parentElement.classList.contains("completed")) {
      editTodos(todo);
    }
  }
}
function filters(e) {
  const todos = [...todoList.childNodes];
  todos.forEach((todo) => {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}
function clearInput(e) {
  e.preventDefault();
  if (todoInput.classList.contains("edit")) {
    todoInput.classList.remove("edit");
    todoInput.value = "";
    clearBtn.style.display = "none";
  }
}
// storage Functions
function setTodos(id, value, category = "all") {
  let todos = localStorage.getItem("todos")
    ? JSON.parse(localStorage.getItem("todos"))
    : [];
  todos.push({ id, value, category });
  localStorage.setItem("todos", JSON.stringify(todos));
}
function getTodos() {
  let todos = localStorage.getItem("todos")
    ? JSON.parse(localStorage.getItem("todos"))
    : [];
  todos.forEach((todo) => {
    const todoDive = document.createElement("div");
    todoDive.classList.add("todo");
    if (todo.category === "all") {
      todoDive.classList.toggle("all");
    } else if (todo.category === "completed") {
      todoDive.classList.toggle("completed");
    }
    const newTodo = `<li id=${todo.id}>${todo.value}</li>
            <span><i class="far fa-check-square"></i></span>
            <span><i class="far fa-edit"></i></span>
            <span><i class="far fa-trash-alt"></i></span>`;
    todoDive.innerHTML = newTodo;
    todoList.appendChild(todoDive);
  });
}
function updateTodos(todo) {
  let todos = localStorage.getItem("todos")
    ? JSON.parse(localStorage.getItem("todos"))
    : [];
  if (todo.classList.contains("completed")) {
    todos.filter((t) => {
      if (t.id == todo.children[0].id) t.category = "completed";
    });
  } else {
    todos.filter((t) => {
      if (t.id == todo.children[0].id) t.category = "all";
    });
  }
  localStorage.setItem("todos", JSON.stringify(todos));
}
function removeTodos(todo) {
  let todos = localStorage.getItem("todos")
    ? JSON.parse(localStorage.getItem("todos"))
    : [];
  const filteredTodos = todos.filter((t) => t.id != todo.children[0].id);
  localStorage.setItem("todos", JSON.stringify(filteredTodos));
}
function editTodos(todo) {
  todoInput.classList.toggle("edit");
  todoInput.value = todo.children[0].innerHTML;
  clearBtn.style.display = "flex";
  todoInput.focus();
  let edit = localStorage.getItem("edit")
    ? JSON.parse(localStorage.getItem("edit"))
    : [];
  edit = [{ id: todo.children[0].id, value: todo.children[0].innerHTML }];
  localStorage.setItem("edit", JSON.stringify(edit));
}
