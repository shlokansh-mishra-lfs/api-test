const API = "https://mongo-api-tys2.onrender.com";

let lastDataHash = "";

document.addEventListener("DOMContentLoaded", () => {
  loadUsers(); // initial load
  setInterval(loadUsers, 5000); // auto-refresh every 5 sec
});

async function loadUsers() {
  console.log("🔄 Checking for updates...");

  try {
    const res = await fetch(`${API}/users`);
    if (!res.ok) throw new Error("API failed");

    const users = await res.json();

    const currentHash = JSON.stringify(users);

    if (currentHash !== lastDataHash) {
      console.log("🔁 Changes detected, updating UI...");
      renderUsers(users);
      lastDataHash = currentHash;
    } else {
      console.log("✅ No changes");
    }

  } catch (err) {
    console.error("❌ Error fetching users:", err.message);
    document.getElementById("status").textContent = "Failed to sync.";
  }
}

function renderUsers(users) {
  const list = document.getElementById("user-list");
  list.innerHTML = "";

  users.forEach(user => {
  const div = document.createElement("div");
  div.className = "user";

  div.innerHTML = `
    <div>
      <input type="text" value="${user.name}" id="name-${user._id}" />
      ${user.email !== undefined ? `<input type="email" value="${user.email}" id="email-${user._id}" />` : ""}
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
  const name = document.getElementById(`name-${id}`).value.trim();
  const emailInput = document.getElementById(`email-${id}`);
  const email = emailInput ? emailInput.value.trim() : undefined;

  const user = { name };
  if (email) user.email = email;

  const res = await fetch(`${API}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  document.getElementById("status").textContent = res.ok ? "User updated!" : "Update failed";
  loadUsers();
}

async function deleteUser(id) {
  const res = await fetch(`${API}/users/${id}`, { method: "DELETE" });
  document.getElementById("status").textContent = res.ok ? "User deleted!" : "Delete failed";
}

document.getElementById("user-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  // Only add email if not empty
  const user = { name };
  if (email) user.email = email;

  const res = await fetch(`${API}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  document.getElementById("status").textContent = res.ok ? "User added!" : "Add failed";
  document.getElementById("user-form").reset();
  loadUsers();
});
