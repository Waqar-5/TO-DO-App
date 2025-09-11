// ✅ Grab elements (using 'var' everywhere)
var input = document.getElementById("input");          // Input box for typing tasks
var category = document.getElementById("category");    // Dropdown for selecting category
var ul = document.getElementById("output");            // <ul> where tasks will be shown
var addBtn = document.getElementById("addBtn");        // Add button
var updateBtn = document.getElementById("updateBtn");  // Update button (for editing)
var progressBar = document.getElementById("progress-bar"); // Progress bar element
var themeToggle = document.getElementById("themeToggle");  // Theme toggle button (dark/light)

// ✅ Variables to handle app state
var editId = null;  // Stores the ID of task being edited
// Load todos from localStorage (saved tasks) or empty array if none
var todos = JSON.parse(localStorage.getItem("todos")) || [];

// ✅ Render tasks when page loads
window.onload = renderTodos;

// ✅ Add a new task
function addTodo() {
  var task = input.value.trim(); // Get value from input box, remove spaces
  if (task === "") return alert("⚠️ Please enter a task!"); // Prevent empty task

  var todo = {
    id: Date.now(),            // Unique ID using timestamp
    text: task,                // Task text
    category: category.value,  // Selected category
    done: false                // Default = not done
  };

  todos.push(todo);   // Add new task into array
  saveTodos();        // Save updated list into localStorage
  renderTodos();      // Show updated list on screen

  input.value = "";   // Clear input field
}

// ✅ Delete a task by ID
function deleteTodo(id) {
  todos = todos.filter(function(todo) {
    return todo.id !== id;   // Keep all except the one with matching ID
  });
  saveTodos();
  renderTodos();
}

// ✅ Edit a task
function editTodo(id) {
  var todo = todos.find(function(t) {
    return t.id === id;
  });

  if (!todo) return; // Exit if not found

  input.value = todo.text;         // Put task text back in input
  category.value = todo.category;  // Set category back
  editId = id;                     // Save current editing ID

  addBtn.style.display = "none";        // Hide Add button
  updateBtn.style.display = "inline-block"; // Show Update button
}

// ✅ Update a task
function updateTodo() {
  if (editId === null) return alert("No task selected!");

  var newTask = input.value.trim();
  if (newTask === "") return alert("⚠️ Task cannot be empty!");

  // Replace the task text with updated one
  todos = todos.map(function(todo) {
    return todo.id === editId
      ? { ...todo, text: newTask, category: category.value }
      : todo;
  });

  saveTodos();
  renderTodos();

  input.value = "";   // Clear input field
  editId = null;      // Reset edit mode
  addBtn.style.display = "inline-block"; // Show Add button again
  updateBtn.style.display = "none";      // Hide Update button
}

// ✅ Mark task as done or undone
function markDone(id) {
  todos = todos.map(function(todo) {
    return todo.id === id
      ? { ...todo, done: !todo.done } // Toggle done/undone
      : todo;
  });

  saveTodos();
  renderTodos();
}

// ✅ Render tasks on screen
function renderTodos() {
  ul.innerHTML = ""; // Clear old list

  todos.forEach(function(todo) {
    var li = document.createElement("li"); // Create <li>
    li.setAttribute("id", todo.id);

    if (todo.done) li.classList.add("done"); // If completed → add class

    li.innerHTML = `
      <span>[${todo.category}] ${todo.text}</span>
      <div class="actions">
        <button class="edit-btn" onclick="editTodo(${todo.id})">✏️</button>
        <button class="delete-btn" onclick="deleteTodo(${todo.id})">🗑️</button>
        <button class="done-btn" onclick="markDone(${todo.id})">${todo.done ? "↩️" : "✅"}</button>
      </div>
    `;

    ul.appendChild(li); // Add task to list
  });

  updateProgress(); // Update progress bar
}

// ✅ Progress bar update
function updateProgress() {
  var total = todos.length;                    // Total tasks
  var done = todos.filter(function(t) { return t.done; }).length; // Completed tasks
  var percent = total === 0 ? 0 : (done / total) * 100; // % completed
  progressBar.style.width = percent + "%";     // Adjust width of bar
}

// ✅ Save all tasks into localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ✅ Dark/Light mode toggle
themeToggle.onclick = function() {
  document.body.classList.toggle("dark"); // Switch class
  themeToggle.textContent = document.body.classList.contains("dark")
    ? "☀️"
    : "🌙"; // Change icon accordingly
};
