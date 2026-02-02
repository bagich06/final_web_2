async function loadAdminProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login.html";
    return;
  }
  try {
    const res = await fetch("/api/users/profile", {
      headers: { Authorization: "Bearer " + token },
    });
    if (!res.ok) {
      window.location.href = "/login.html";
      return;
    }
    const user = await res.json();
    if (user.role !== "admin") {
      window.location.href = "/login.html";
      return;
    }
    document.getElementById("profileName").textContent = user.username;
    document.getElementById("profileEmail").textContent = user.email;
    document.getElementById("profileAvatar").textContent =
      user.username[0].toUpperCase();
    document.getElementById("adminProfileInfo").innerHTML = `
      <div><b>Имя:</b> ${user.username}</div>
      <div><b>Email:</b> ${user.email}</div>
      <div><b>Роль:</b> ${user.role}</div>
      <div><b>Дата регистрации:</b> ${user.createdAt ? new Date(user.createdAt).toLocaleDateString("ru-RU") : ""}</div>
    `;
  } catch (e) {
    window.location.href = "/login.html";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = function () {
      localStorage.removeItem("token");
      window.location.href = "/login.html";
    };
  }
  loadAdminProfile();
});
