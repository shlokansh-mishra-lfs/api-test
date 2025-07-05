const API_BASE = "https://mongo-api-tys2.onrender.com"; // 🔁 Replace with deployed backend URL

window.onload = loadUsers;

 async function loadUsers() {
  const res = await fetch(`${API}/users`);
  const users = await res.json();
  const list = document.getElementById("user-list");
  list.innerHTML = "";

  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "user";

    div.innerHTML = `
      <div>
        <input type="text" value="${user.name}" id="name-${user._id}" />
        <input type="email" value="${user.email}" id="email-${user._id}" />
      </div>
      <div class="user-actions">
        <button class="update-btn" onclick="updateUser('${user._id}')">Update</button>
        <button class="delete-btn" onclick="deleteUser('${user._id}')">Delete</button>
      </div>
    `;

    list.appendChild(div);
  });
}

async function updateUser(id) {
  const name = document.getElementById(`name-${id}`).value;
  const email = document.getElementById(`email-${id}`).value;

  const res = await fetch(`${API}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email })
  });

  document.getElementById("status").textContent = res.ok ? "User updated!" : "Update failed";
  loadUsers();
}

async function deleteUser(id) {
  const res = await fetch(`${API}/users/${id}`, {
    method: "DELETE"
  });

  document.getElementById("status").textContent = res.ok ? "User deleted!" : "Delete failed";
  loadUsers();
}

document.getElementById("user-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  const res = await fetch(`${API}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email })
  });

  document.getElementById("status").textContent = res.ok ? "User added!" : "Add failed";
  document.getElementById("user-form").reset();
  loadUsers();
});

window.onload = loadUsers;
