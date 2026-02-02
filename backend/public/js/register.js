document.getElementById("registerForm").onsubmit = async function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    window.location.href = "/catalog.html";
  } else {
    document.getElementById("registerError").innerText =
      data.message ||
      (data.errors && data.errors[0].msg) ||
      "Ошибка регистрации";
  }
};
