const API_BASE = "https://mongo-api-tys2.onrender.com"; // 🔁 Replace with deployed backend URL

window.onload = loadUsers;

function loadUsers() {
  const card = document.getElementById("user-card");
  card.innerHTML = "<p>Loading users...</p>";

  fetch(`${API_BASE}/users`)
    .then((res) => res.json())
    .then((users) => {
      if (users.length === 0) {
        card.innerHTML = "<p>No users found.</p>";
        return;
      }

      card.innerHTML = "";
      users.forEach((user) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <h3>${user.name}</h3>
          <p>${user.email}</p>
          <button onclick="deleteUser('${user._id}')">Delete</button>
          <button onclick="showEditForm('${user._id}', '${user.name}', '${user.email}')">Edit</button>
        `;
        card.appendChild(div);
      });
    })
    .catch((err) => {
      console.error(err);
      card.innerHTML = "<p>Error fetching users.</p>";
    });
}

// Handle Add New User
document.getElementById("userForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const status = document.getElementById("postStatus");

  try {
    const response = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    if (response.ok) {
      status.textContent = "User added!";
      document.getElementById("userForm").reset();
      loadUsers();
    } else {
      status.textContent = "Failed to add user.";
    }
  } catch (err) {
    console.error(err);
    status.textContent = "Server error.";
  }
});

// Delete user
async function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("User deleted.");
      loadUsers();
    } else {
      alert("Error deleting user.");
    }
  } catch (err) {
    console.error(err);
    alert("Server error.");
  }
}

// Show edit form
function showEditForm(id, currentName, currentEmail) {
  const name = prompt("Enter new name:", currentName);
  const email = prompt("Enter new email:", currentEmail);

  if (name && email) {
    updateUser(id, name, email);
  }
}

// Update user
async function updateUser(id, name, email) {
  try {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    if (res.ok) {
      alert("User updated.");
      loadUsers();
    } else {
      alert("Update failed.");
    }
  } catch (err) {
    console.error(err);
    alert("Server error.");
  }
}
