// selectors
const todoInput = document.querySelector(".todo-input");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todo-list");
const selectFilter = document.querySelector(".filter__todos");
const selectSort = document.querySelector(".sort__todos");
const backdrop = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".close__modal");
const modalInput = document.querySelector(".modal__input");
const modalBtn = document.querySelector(".modal__btn");
// Variable
let filterValue = "";
let sortValue = "";
// Events
backdrop.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);
modalBtn.addEventListener("click", addEditTodo);
todoForm.addEventListener("submit", addNewTodo);
selectFilter.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filterTodos(e);
  addNewSettings(e);
});
selectSort.addEventListener("change", (e) => {
  sortValue = e.target.value;
  sortTodos(e);
  addNewSettings(e);
});
document.addEventListener("DOMContentLoaded", (e) => {
  const todos = getAllTodos();
  saveSettings();
  filterTodos(todos);
  refrashEdit(todos);
});
// Create Todos
function createTodos(todos) {
  let result = "";
  todos.forEach((todo) => {
    result += `<li class="todo">
            <p class="todo__title ${todo.isCompleted && "completed"} ${
      todo.edit && "edit"
    }">${todo.titel}</p>
            <div class="todo__options">
              <div class="todo__btns">
                <button class="todo__check" data-todo-id=${todo.id}>
                  <i class="far fa-check-square"></i>
                </button>
                <button class="todo__edit" data-todo-id=${todo.id}>
                  <i class="far fa-edit"></i>
                </button>
                <button class="todo__remove" data-todo-id=${todo.id}>
                  <i class="far fa-trash-alt"></i>
                </button>
              </div>
              <span class="todo__createdat">${new Date(
                todo.createdAt
              ).toLocaleDateString("fa-ir")}</span>
            </div>
          </li>`;
  });
  todoList.innerHTML = result;
  todoInput.value = "";

  const removeBtns = [...document.querySelectorAll(".todo__remove")];
  removeBtns.forEach((btn) => btn.addEventListener("click", removeTodo));

  const checkBtns = [...document.querySelectorAll(".todo__check")];
  checkBtns.forEach((btn) => btn.addEventListener("click", checkTodo));

  const editBtn = [...document.querySelectorAll(".todo__edit")];
  editBtn.forEach((btn) => btn.addEventListener("click", editTodo));
}
// Add New Todo
function addNewTodo(e) {
  e.preventDefault();
  if (!todoInput.value) return null;
  newTodo = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    titel: todoInput.value,
    isCompleted: false,
    edit: false,
  };
  saveTodo(newTodo);
  sortTodos();
}
// Filter Todos
function filterTodos(e) {
  const todos = getAllTodos();
  switch (filterValue) {
    case "all": {
      createTodos(todos);
      break;
    }
    case "completed": {
      const filteredTodos = todos.filter((t) => t.isCompleted);
      createTodos(filteredTodos);
      break;
    }
    case "uncompleted": {
      const filteredTodos = todos.filter((t) => !t.isCompleted);
      createTodos(filteredTodos);
      break;
    }

    default:
      createTodos(todos);
  }
}
// Sort todos
function sortTodos(e) {
  const todos = getAllTodos();
  switch (sortValue) {
    case "addeddate": {
      const sortedTodos = todos.sort((a, b) => a.id - b.id);
      saveAllTodos(sortedTodos);
      filterTodos(todos);
      break;
    }
    case "duedate": {
      const sortedTodos = todos.sort((a, b) => b.id - a.id);
      saveAllTodos(sortedTodos);
      filterTodos(todos);
      break;
    }
    default:
      filterTodos(todos);
  }
}
// Remove Todo
function removeTodo(e) {
  let todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  todos = todos.filter((t) => t.id !== todoId);
  saveAllTodos(todos);
  filterTodos(todos);
}
// Check Todo
function checkTodo(e) {
  const todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  const todo = todos.find((t) => t.id === todoId);
  todo.isCompleted = !todo.isCompleted;
  saveAllTodos(todos);
  filterTodos(todos);
}
// Local Storage
function getAllTodos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  return savedTodos;
}
function saveTodo(todo) {
  const savedTodos = getAllTodos();
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
  return savedTodos;
}
const saveAllTodos = (todos) =>
  localStorage.setItem("todos", JSON.stringify(todos));
function saveSettings(e) {
  const savedSettings = JSON.parse(localStorage.getItem("settings")) || [];
  if (!savedSettings.length) {
    settings = [
      {
        filters: "all",
        sorts: "addeddate",
      },
    ];
    localStorage.setItem("settings", JSON.stringify(settings));
  }
  selectSort.value = savedSettings[0].sorts;
  selectFilter.value = savedSettings[0].filters;
  filterValue = savedSettings[0].filters;
  sortValue = savedSettings[0].sorts;
}
function addNewSettings(e) {
  const savedSettings = JSON.parse(localStorage.getItem("settings")) || [];
  if (e.target.classList.contains("sort__todos")) {
    savedSettings[0].sorts = e.target.value;
    localStorage.setItem("settings", JSON.stringify(savedSettings));
  } else if (e.target.classList.contains("filter__todos")) {
    savedSettings[0].filters = e.target.value;
    localStorage.setItem("settings", JSON.stringify(savedSettings));
  }
}
// Modal
function editTodo(e) {
  backdrop.classList.remove("hidden");
  modal.classList.remove("hidden");
  const todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  const todo = todos.find((t) => t.id === todoId);
  todo.edit = !todo.edit;
  modalInput.value = todo.titel;
  modalInput.focus();
  saveAllTodos(todos);
}
function closeModal() {
  backdrop.classList.add("hidden");
  modal.classList.add("hidden");
  const todos = getAllTodos();
  const todo = todos.find((t) => t.edit === true);
  todo.edit = false;
  saveAllTodos(todos);
}
function addEditTodo(e) {
  e.preventDefault();
  const todos = getAllTodos();
  const todo = todos.find((t) => t.edit);
  todo.titel = modalInput.value;
  todo.edit = false;
  saveAllTodos(todos);
  backdrop.classList.add("hidden");
  modal.classList.add("hidden");
  filterTodos();
}
function refrashEdit(todos) {
  const todo = todos.find((t) => t.edit === true);
  if (todo) {
    backdrop.classList.remove("hidden");
    modal.classList.remove("hidden");
    modalInput.value = todo.titel;
    modalInput.focus();
  }
}
