const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoListUL = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");

let isSelectionMode = false;
const selectionToggle = document.getElementById("selection-toggle");
const deleteAllBtn = document.getElementById("delete-all-button");

let allTodos = getTodos();
updateTodoList();

selectionToggle.addEventListener("click", () => {
  isSelectionMode = !isSelectionMode;

  if (isSelectionMode) {
    selectionToggle.innerText = "Cancel";
    deleteAllBtn.style.display = "block";
    todoListUL.classList.add("selection-active");
  } else {
    selectionToggle.innerText = "Select";
    deleteAllBtn.style.display = "none";
    todoListUL.classList.remove("selection-active");
  }

  allTodos.forEach((t) => {
    t.selected = false;
  });

  const allItems = todoListUL.querySelectorAll(".todo");
  allItems.forEach((li) => {
    li.classList.remove("selected");
    const cb = li.querySelector("input[type='checkbox']");
    if (cb) cb.checked = false;
  });
});

deleteAllBtn.addEventListener("click", () => {
  allTodos = allTodos.filter((todo) => !todo.selected);
  saveTodos();
  updateTodoList();

  isSelectionMode = false;
  selectionToggle.innerText = "Select";
  deleteAllBtn.style.display = "none";
  todoListUL.classList.remove("selection-active");
});

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addTodo();
});

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText.length > 0) {
    const todoObject = {
      text: todoText,
      completed: false,
      selected: false,
    };
    allTodos.push(todoObject);
    updateTodoList();
    saveTodos();
    todoInput.value = "";
  }
}

function updateTodoList() {
  todoListUL.innerHTML = "";

  if (allTodos.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  allTodos.forEach((todo, todoIndex) => {
    const todoItem = createTodoItem(todo, todoIndex);
    todoListUL.append(todoItem);
  });
}

function createTodoItem(todo, todoIndex) {
  const todoId = "todo-" + todoIndex;
  const todoLI = document.createElement("li");
  todoLI.className = "todo";

  if (todo.selected) todoLI.classList.add("selected");

  const editIcon = `<svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-200h57l391-391-57-57-391 391v57Z"/></svg>`;
  const saveIcon = `<svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>`;

  todoLI.innerHTML = `
        <input type="checkbox" id="${todoId}">
        <label class="custom-checkbox" for="${todoId}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
        </label>
        <input type="text" class="todo-text-input" value="${todo.text}" readonly>
        <button class="edit-button">${editIcon}</button>
        <button class="delete-button">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520Z"/></svg>
        </button>
    `;

  const checkbox = todoLI.querySelector("input[type='checkbox']");
  const editButton = todoLI.querySelector(".edit-button");
  const textInput = todoLI.querySelector(".todo-text-input");
  const deleteButton = todoLI.querySelector(".delete-button");

  checkbox.checked = todo.completed || todo.selected;

  todoLI.addEventListener("click", () => {
    if (isSelectionMode) {
      todo.selected = !todo.selected;
      checkbox.checked = todo.selected;
      todoLI.classList.toggle("selected", todo.selected);
    }
  });

  editButton.addEventListener("click", () => {
    if (textInput.hasAttribute("readonly")) {
      textInput.removeAttribute("readonly");
      textInput.classList.add("editing");
      textInput.focus();
      editButton.innerHTML = saveIcon;
    } else {
      const newText = textInput.value.trim();
      if (newText.length > 0) {
        allTodos[todoIndex].text = newText;
        saveTodos();
        textInput.setAttribute("readonly", true);
        textInput.classList.remove("editing");
        editButton.innerHTML = editIcon;
      }
    }
  });

  deleteButton.addEventListener("click", () => deleteTodoItem(todoIndex));

  checkbox.addEventListener("change", () => {
    if (!isSelectionMode) {
      allTodos[todoIndex].completed = checkbox.checked;
      saveTodos();
    }
  });

  return todoLI;
}

function deleteTodoItem(todoIndex) {
  allTodos = allTodos.filter((_, i) => i !== todoIndex);
  saveTodos();
  updateTodoList();
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(allTodos));
}

function getTodos() {
  const todos = localStorage.getItem("todos") || "[]";
  return JSON.parse(todos);
}
