const API = "https://mongo-api-tys2.onrender.com";

//window.onload = () => {
//  loadUsers();
//  setInterval(loadUsers, 5000); // every 5 seconds
//};

document.addEventListener("DOMContentLoaded", () => {
  loadUsers();
  setInterval(loadUsers, 5000); // 🔁 auto-refresh every 5 seconds
});

async function loadUsers() {
  console.log("Refreshing users...");

  try {
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
          <button onclick="updateUser('${user._id}')">Update</button>
          <button class="delete-btn" onclick="deleteUser('${user._id}')">Delete</button>
        </div>
      `;

      list.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load users", err);
    document.getElementById("status").textContent = "Failed to load users.";
  }
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


