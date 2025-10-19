const input = document.querySelector("#task-input");
const addBtn = document.querySelector("#add-task");
const taskList = document.querySelector(".task-list");
const message = document.querySelector(".message");

// -------- Local Storage Helper Functions --------
function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// -------- Render Tasks on Load --------
function renderTasks() {
  taskList.innerHTML = "";
  const tasks = getTasks();

  if (tasks.length === 0) {
    message.textContent = "No task added yet!";
    message.style.display = "block";
  } else {
    message.style.display = "none";
    tasks.forEach((task) => {
      createTaskElement(task.text, task.completed);
    });
  }
}
renderTasks();


// -------- Create Task Element --------
function createTaskElement(taskHeading, completed = false) {
  const taskItem = document.createElement("div");
  taskItem.classList.add("task-items");

  taskItem.innerHTML = `
      <label class="checkbox">
        <input type="checkbox" class="cb" ${completed ? "checked" : ""}/>
        <span class="box" aria-hidden="true"></span>
      </label>
      <div class="task-heading ${completed ? "completed" : ""}">${taskHeading}</div>
      <i class="fa-solid fa-pen-to-square editBtn"></i>
      <i class="fa-solid fa-trash delete-btn"></i>
  `;

  // delete functionality
  const deleteBtn = taskItem.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    taskItem.remove();
    let tasks = getTasks().filter((t) => t.text !== taskHeading);
    saveTasks(tasks);
    if (taskList.querySelectorAll(".task-items").length === 0) {
      message.style.display = "block";
    }
  });

  // edit functionality
  const editBtn = taskItem.querySelector(".editBtn");
  editBtn.addEventListener("click", () => {
    taskItem.remove();
    let tasks = getTasks().filter((t) => t.text !== taskHeading);
    saveTasks(tasks);
    input.value = taskHeading;
  });

  // checkbox functionality (mark completed)
  const checkbox = taskItem.querySelector(".cb");
  const headingDiv = taskItem.querySelector(".task-heading");

  checkbox.addEventListener("change", () => {
    let tasks = getTasks();
    tasks = tasks.map((t) =>
      t.text === taskHeading ? { ...t, completed: checkbox.checked } : t
    );
    saveTasks(tasks);

    if (checkbox.checked) {
      headingDiv.classList.add("completed");
    } else {
      headingDiv.classList.remove("completed");
    }
  });

  taskList.prepend(taskItem);
}

// -------- Add Task Button --------
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const taskHeading = input.value.trim();

  if (taskHeading !== "") {
    let tasks = getTasks();
    tasks.push({ text: taskHeading, completed: false });
    saveTasks(tasks);

    createTaskElement(taskHeading, false);

    input.value = "";
    message.style.display = "none";
  }
});

// -------- Custom cursor --------
const cursor = document.querySelector(".cursor");
const base = document.querySelector(".todo-app");

base.addEventListener("mousemove", (e) => {
  const rect = base.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  cursor.style.left = `${x}px`;
  cursor.style.top = `${y}px`;
  cursor.style.display = "block";
});

base.addEventListener("mouseleave", () => {
  cursor.style.display = "none";
});

base.addEventListener("mouseenter", () => {
  cursor.style.display = "block";
});
