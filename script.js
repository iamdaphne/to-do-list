'use strict';

//Checkbox
function toggleTaskCompletion(checkbox, taskText) {
  if (checkbox.checked) {
    taskText.classList.add("completed");
  } else {
    taskText.classList.remove("completed");
  }
}

//Creates Template
function createTaskElement(taskDescription) {
  const template = document.getElementById("task-template").content;
  const clone = document.importNode(template, true);

  const uniqueId = crypto.randomUUID();
  const taskText = clone.querySelector(".task-text");
  taskText.id = uniqueId;
  taskText.textContent = taskDescription;

  const checkbox = clone.querySelector(".form-check-input");
  // Event Listener, which calls toggleTaskCompletion
  checkbox.addEventListener('change', function () {
    toggleTaskCompletion(this, taskText);
  });

  const deleteButton = clone.querySelector('.delete-button');
  deleteButton.addEventListener('click', function () {
    this.parentNode.remove();
    saveTasks();
  });

  return clone;
}
function saveTasks() {
  const tasks = [];
  document.querySelectorAll(".task-text").forEach(taskText => {
    tasks.push({ id: taskText.id, description: taskText.textContent, completed: taskText.classList.contains("completed") });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (savedTasks) {
    savedTasks.forEach(task => {
      const taskElement = createTaskElement(task.description);
      const checkbox = taskElement.querySelector(".form-check-input");
      const taskText = taskElement.querySelector(".task-text");
      if (task.completed) {
        checkbox.checked = true;
        taskText.classList.add("completed");
      }
      // add task element to list without calling saveTasks and to avoid recursive saving
      document.getElementById("todo-list").appendChild(taskElement);
    });
  }
}

// Call loadTasks when page is loaded
document.addEventListener("DOMContentLoaded", loadTasks);

// Add element via keyboard and pass on to addElement()
const listInput = document.getElementById("todo-input");
listInput.addEventListener("keydown", onKey);

function onKey(e) {
  if (e.key === "Enter") {
    addElement();
  }
}

// Add element via onclick
const placeholderDefault = "Add a new task";
const placeholderReminder = "Type something";
document.getElementById("todo-input").placeholder = placeholderDefault;

function addElement() {
  const listInput = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");

  if (listInput.value.trim() === '' || listInput === null) {
    listInput.placeholder = placeholderReminder;
  } else {
    const taskElement = createTaskElement(listInput.value.trim());
    list.appendChild(taskElement); // adds task element to list
    listInput.value = ''; // empty input field
    listInput.placeholder = placeholderDefault; // reset placeholder text
  }
  saveTasks(); // saves current to do list in localStorage
}

// Event Listener which calls deleteTask()
document.getElementById("todo-list").addEventListener('click', deleteTask);
function deleteTask(e) {
  if (e.target.classList.contains('delete-button')) {
    e.target.parentNode.remove();
  }
}