async function loadProfile() {
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
    document.getElementById("profileName").textContent = user.username;
    document.getElementById("profileEmail").textContent = user.email;
    document.getElementById("profileAvatar").textContent =
      user.username[0].toUpperCase();

    // Загрузка истории заказов
    const ordersRes = await fetch("/api/users/orders", {
      headers: { Authorization: "Bearer " + token },
    });
    let orders = await ordersRes.json();
    if (!Array.isArray(orders)) orders = [];
    let html = "";
    orders.forEach((order) => {
      // Подсчет количества товаров и суммы
      const count = order.products
        ? order.products.reduce((acc, item) => acc + item.quantity, 0)
        : 0;
      const sum = order.products
        ? order.products.reduce(
            (acc, item) =>
              acc +
              (item.product && item.product.price
                ? item.product.price * item.quantity
                : 0),
            0,
          )
        : 0;
      // Список товаров
      let productsList = "";
      if (order.products && order.products.length) {
        productsList =
          '<ul style="margin:8px 0 0 0;padding-left:18px;font-size:1rem;color:#444;">';
        order.products.forEach((item) => {
          if (item.product && item.product.name) {
            productsList += `<li>${item.product.name} <span style="color:#888;">x${item.quantity}</span></li>`;
          }
        });
        productsList += "</ul>";
      }
      html += `<div class="order-card">
        <div class="order-info">
          <div class="order-id">ORD-${order._id.toString().slice(-4)}
            <span class="order-status ${order.status === "delivered" ? "delivered" : "in-progress"}">
              ${order.status === "delivered" ? "ДОСТАВЛЕН" : "В ПУТИ"}
            </span>
          </div>
          <div class="order-date">от ${order.createdAt ? new Date(order.createdAt).toLocaleDateString("ru-RU") : ""}</div>
          <div class="order-count">${count} товар${count === 1 ? "" : "а"}</div>
          ${productsList}
        </div>
        <div class="order-sum">${sum} ₽</div>
      </div>`;
    });
    document.getElementById("orderHistory").innerHTML = html;
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
  loadProfile();
});
