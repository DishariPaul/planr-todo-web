const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
console.log(taskInput, addBtn, taskList);
/*===LOCAL STORAGE=====*/
//if tasks already in local storage -> loads them, else starts with an empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks(); //shows tasks when page loads

addBtn.addEventListener("click", () => {
  console.log("ADD BUTTON CLICKED");
  addTask();
});
taskInput.addEventListener("keypress", function (e){
    if (e.key === "Enter"){addTask();}
});

function addTask(){
    const text = taskInput.value.trim();
    if (text==="") return; //to prevent entering of empty tasks
    const task = { //creating task object along with its properties
        text: text,
        completed: false
    };
    tasks.push(task);   //adding to the task array
    saveTasks();
    renderTasks();
}
/*==== SAVING TO THE LOCAL STORAGE====*/
function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks)); 
}
/*====DISPLAYING THE TASK====*/
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const label = document.createElement("label");
    label.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const customBox = document.createElement("span");
    customBox.className = "custom-checkbox";
    customBox.setAttribute("title", "Check Box");

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.setAttribute("title", "Delete task");

    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    label.appendChild(checkbox);
    label.appendChild(customBox);
    label.appendChild(text);

    li.appendChild(label);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  updateTaskCounter();
}


/*==== DATE AND TIME INFORMATION =====*/
function updateDateTime() {
    const now = new Date();
    const info = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    document.getElementById("info").textContent = now.toLocaleString("en-IN", info);
}
updateDateTime();               // run once on load of the page
setInterval(updateDateTime, 60000);      // updating it every minute


/*=====TASK COUNTER====*/
function updateTaskCounter() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;

  const counter = document.getElementById("taskCounter");
  counter.textContent = `${completed} / ${total} completed`;

  if (total === 0) {
    counter.textContent = "No tasks yet ✨";
  } else if (completed === total) {
    counter.textContent = "All tasks completed 🎉";
  }

  // for a soft animation
  counter.classList.add("bump");
  setTimeout(() => counter.classList.remove("bump"), 200);
}



/*==== THEME TOGGLE ====*/
;(() => {
    const root = document.documentElement; // chooses the <html>
    const toggle = document.getElementById('themeToggle');
     if (!toggle) return;
    const defaultTheme = "light"; // forcing light as default for webpage, unless toggled
    const saved = localStorage.getItem("theme");
    const initialTheme = saved ? saved : defaultTheme;

    function applyTheme(theme) {
        if (theme === 'dark') {
          root.setAttribute('data-theme', 'dark');
          if (toggle) { 
            toggle.textContent = '☀️'; 
            toggle.setAttribute('aria-pressed', 'true'); 
          }
        } 
        else {
          root.removeAttribute('data-theme');
          if (toggle) { 
            toggle.textContent = '🌙'; 
            toggle.setAttribute('aria-pressed', 'false'); 
          }
        }
        
    }
    applyTheme(initialTheme);
    // toggle handler
    if (toggle) {
        toggle.addEventListener('click', () => {
          const isDark = root.getAttribute('data-theme') === 'dark';
          const next = isDark ? 'light' : 'dark';
          applyTheme(next);
          localStorage.setItem('theme', next);
        });
      }
  })
();