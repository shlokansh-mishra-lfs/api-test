const API_BASE = "https://mongo-api-tys2.onrender.com"; // 🔁 Replace with deployed backend URL

function loadUser() {
  const card = document.getElementById("user-card");
  card.innerHTML = "<p>Loading users...</p>";

  fetch(`${API_BASE}/users`)
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        card.innerHTML = "<p>No users found.</p>";
        return;
      }

      card.innerHTML = "";
      data.forEach((user) => {
        const div = document.createElement("div");
        div.innerHTML = `<h3>${user.name}</h3><p>${user.email}</p>`;
        card.appendChild(div);
      });
    })
    .catch((err) => {
      card.innerHTML = "<p>Error fetching users.</p>";
      console.error(err);
    });
}

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
      status.textContent = "User added successfully!";
      document.getElementById("userForm").reset();
      loadUser();
    } else {
      status.textContent = "Failed to add user.";
    }
  } catch (err) {
    console.error(err);
    status.textContent = "Server error.";
  }
});

window.onload = loadUser;
