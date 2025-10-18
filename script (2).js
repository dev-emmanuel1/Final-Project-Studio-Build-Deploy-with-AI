const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const clearCompletedBtn = document.getElementById("clearCompleted");
const deleteAllBtn = document.getElementById("deleteAll");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    
    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(index));
    
    // Create task text
    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;
    
    if (task.completed) li.classList.add("completed");
    
    // Create delete button
    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "❌";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteTask(index);
    });
    
    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(text) {
  if (text.trim() === "") return alert("Please enter a task");
  tasks.push({ text, completed: false });
  renderTasks();
}

function toggleTask(index) {
  const wasCompleted = tasks[index].completed;
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
  
  // Show congrats animation only when completing (not uncompleting)
  if (!wasCompleted && tasks[index].completed) {
    showCongratsAnimation();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed);
  renderTasks();
}

function deleteAll() {
  if (confirm("Delete all tasks?")) {
    tasks = [];
    renderTasks();
  }
}

function showCongratsAnimation() {
  // Create congrats overlay
  const overlay = document.createElement("div");
  overlay.className = "congrats-overlay";
  
  const congratsBox = document.createElement("div");
  congratsBox.className = "congrats-box";
  congratsBox.innerHTML = `
    <div class="congrats-emoji">🎉</div>
    <h2>Congratulations!</h2>
    <p>Task completed!</p>
  `;
  
  overlay.appendChild(congratsBox);
  document.body.appendChild(overlay);
  
  // Remove after animation
  setTimeout(() => {
    overlay.classList.add("fade-out");
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 500);
  }, 2000);
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(taskInput.value);
  taskInput.value = "";
});

clearCompletedBtn.addEventListener("click", clearCompleted);
deleteAllBtn.addEventListener("click", deleteAll);

renderTasks();
