function goToProtectedPage(path) {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login.html";
    return;
  }
  fetch(path, { headers: { Authorization: "Bearer " + token } })
    .then((r) => {
      if (r.redirected) {
        window.location.href = r.url;
        return;
      }
      return r.text();
    })
    .then((html) => {
      if (html) {
        window.__pageLoadedWithToken = true;
        document.open();
        document.write(html);
        document.close();
      }
    });
}

// Для ссылок с классом .protected-link
function setupProtectedLinks() {
  document.querySelectorAll(".protected-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      goToProtectedPage(link.getAttribute("href"));
    });
  });
}

document.addEventListener("DOMContentLoaded", setupProtectedLinks);
