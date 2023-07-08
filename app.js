class TodoList {
  constructor() {
    this.details = document.querySelector(".details");
    this.addInput = document.querySelector(".addInput");
    this.addBtn = document.querySelector(".addBtn");
    this.navItems = document.querySelectorAll(".nav-item");
    this.firstNav = document.querySelector("#first");
    this.secondNav = document.querySelector("#second");
    this.thirdNav = document.querySelector("#third");
    this.line = document.createElement("div");
    this.addDiv = document.querySelector(".add");
    this.allDeleteButton = document.querySelector(".all-delete");
    this.todos = [];
    this.activeNavItem = null;

    // Bind event listener functions to the correct context
    this.handleAddTodo = this.handleAddTodo.bind(this);
    this.handleAllDelete = this.handleAllDelete.bind(this);
  }

  initialize() {
    this.addLine();
    this.addBtn.addEventListener("click", this.handleAddTodo);
    this.navItems.forEach((navItem) => {
      navItem.addEventListener("click", () => {
        this.setActiveNavItem(navItem);
        this.addLine();
        this.displayTodos();
      });
    });
    this.allDeleteButton.addEventListener("click", this.handleAllDelete);
    this.getTodosFromLocalStorage();
    this.displayTodos();
  }

  addLine() {
    this.line.classList.add("hr");
    this.activeNavItem?.appendChild(this.line);
  }

  displayTodos() {
    const tabId = this.activeNavItem?.id || "first";
    const filteredTodos = this.filterTodos(tabId);
    this.renderTodos(filteredTodos);
    this.updateButtonVisibility(tabId);
  }

  filterTodos(tabId) {
    if (tabId === "first") {
      return this.todos;
    } else if (tabId === "second") {
      return this.todos.filter((todo) => !todo.checked);
    } else if (tabId === "third") {
      return this.todos.filter((todo) => todo.checked);
    }
    return [];
  }

  renderTodos(filteredTodos) {
    this.details.innerHTML = "";
    filteredTodos.forEach((todo) => {
      const listItem = this.createListItem(todo);
      this.details.appendChild(listItem);
    });
  }

  createListItem(todo) {
    const listItem = document.createElement("li");
    const checkbox = document.createElement("input");
    const label = document.createElement("label");
    const deleteButton = document.createElement("button");
  
    listItem.classList.add("details-list");
    checkbox.type = "checkbox";
    checkbox.classList.add("check");
    label.textContent = todo.label;
    checkbox.checked = todo.checked;
  
    listItem.appendChild(checkbox);
    listItem.appendChild(label);
  
    listItem.addEventListener("click", () => {
      checkbox.checked = !checkbox.checked;
      label.style.textDecoration = checkbox.checked ? "line-through" : "none";
      this.updateTodoStatus(todo, checkbox.checked);
      this.updateButtonVisibility(this.activeNavItem?.id);
  
      const deleteButton = listItem.querySelector(".btn-danger");
      if (this.activeNavItem?.id === "third" && checkbox.checked) {
        if (!deleteButton) {
          this.createDeleteButton(listItem, todo);
        }
      } else {
        if (deleteButton) {
          deleteButton.remove();
        }
      }
    });
  
    if (this.activeNavItem?.id === "third" && todo.checked) {
      this.createDeleteButton(listItem, todo);
    }
  
    listItem.style.listStyle ="none"
    listItem.style.fontSize = "20px"; // Set the font size to 20px
    listItem.style.padding = "10px";
    listItem.style.margin = "10px"; 
    listItem.style.backgroundColor = "#fef8dd"
    

    checkbox.style.marginRight  = "15px"
  
    checkbox.style.transform = "scale(1.5)";
    return listItem;
  }

  createDeleteButton(listItem, todo) {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-sm", "btn-danger");
    deleteButton.innerHTML = '<i class="bi bi-trash"> Delete</i>';
  
    deleteButton.addEventListener("click", () => {
      listItem.remove();
      this.removeTodoFromList(todo);
      this.updateLocalStorage();
      this.updateButtonVisibility(this.activeNavItem?.id);
    });
  
    deleteButton.style.transform = "scale(1.1)"; // Increase the size of the delete button
    deleteButton.style.marginLeft = "60%"; // Adjust the margin-left to 50px
    deleteButton.style.padding = "5px"; // Add 5px padding
  
    listItem.appendChild(deleteButton);
  }
  

  handleAddTodo() {
    const todoText = this.addInput.value.trim();
    if (todoText !== "") {
      const newTodo = {
        label: todoText,
        checked: false,
      };
      this.todos.push(newTodo);
      this.updateLocalStorage();
      this.displayTodos();
      this.addInput.value = "";
    }
  }

  updateTodoStatus(todo, completed) {
    todo.checked = completed;
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  getTodosFromLocalStorage() {
    const storedTodos = localStorage.getItem("todos");
    this.todos = storedTodos ? JSON.parse(storedTodos) : [];
  }

  setActiveNavItem(navItem) {
    this.activeNavItem?.classList.remove("active");
    navItem.classList.add("active");
    this.activeNavItem = navItem;
  }

  removeTodoFromList(todo) {
    this.todos = this.todos.filter((item) => item !== todo);
  }

  updateButtonVisibility(tabId) {
    const completedTodos = this.todos.filter((todo) => todo.checked);
    this.allDeleteButton.style.display = tabId === "third" && completedTodos.length > 0 ? "block" : "none";
  }

  handleAllDelete() {
    const completedTodos = this.todos.filter((todo) => todo.checked);
    completedTodos.forEach((completedTodo) => {
      this.removeTodoFromList(completedTodo);
    });

    this.updateLocalStorage();
    this.displayTodos();
  }
}

const todoList = new TodoList();
todoList.initialize();
