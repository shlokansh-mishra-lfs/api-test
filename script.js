function loadUser() {
  const card = document.getElementById("user-card");
  card.innerHTML = "<p>Loading...</p>";

  fetch("https://randomuser.me/api/")
    .then((res) => res.json())
    .then((data) => {
      const user = data.results[0];
      card.innerHTML = `
        <img src="${user.picture.large}" alt="User Picture" width="100" />
        <h2>${user.name.first} ${user.name.last}</h2>
        <p>Email: ${user.email}</p>
      `;
    })
    .catch((err) => {
      card.innerHTML = "<p>Failed to fetch user data.</p>";
      console.error(err);
    });
}

window.onload = loadUser;
