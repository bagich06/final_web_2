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
    // Получаем защищённую страницу с токеном
    fetch("/catalog.html", {
      headers: { Authorization: "Bearer " + data.token },
    })
      .then((r) => r.text())
      .then((html) => {
        document.open();
        document.write(html);
        document.close();
      });
  } else {
    document.getElementById("loginError").innerText =
      data.message || (data.errors && data.errors[0].msg) || "Ошибка входа";
  }
};
