document.getElementById("loginForm").onsubmit = async function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    // Проверяем роль пользователя
    const profileRes = await fetch("/api/users/profile", {
      headers: { Authorization: "Bearer " + data.token },
    });
    if (profileRes.ok) {
      const user = await profileRes.json();
      if (user.role === "admin") {
        window.location.href = "/admin.html";
        return;
      }
    }
    window.location.href = "/catalog.html";
  } else {
    document.getElementById("loginError").innerText =
      data.message || (data.errors && data.errors[0].msg) || "Ошибка входа";
  }
};
