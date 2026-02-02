function getToken() {
  return localStorage.getItem("token");
}

function statusLabel(status) {
  if (status === "pending") return "Ожидает";
  if (status === "shipped") return "В пути";
  if (status === "delivered") return "Доставлен";
  return status;
}

async function loadOrders() {
  const token = getToken();
  if (!token) {
    window.location.href = "/login.html";
    return;
  }
  // Проверяем роль пользователя
  const profileRes = await fetch("/api/users/profile", {
    headers: { Authorization: "Bearer " + token },
  });
  if (!profileRes.ok) {
    window.location.href = "/login.html";
    return;
  }
  const user = await profileRes.json();
  if (!user.role || user.role !== "admin") {
    window.location.href = "/login.html";
    return;
  }
  const res = await fetch("/api/admin/orders", {
    headers: { Authorization: "Bearer " + token },
  });
  if (!res.ok) {
    document.getElementById("ordersBody").innerHTML =
      '<tr><td colspan="6">Нет доступа</td></tr>';
    return;
  }
  const orders = await res.json();
  const tbody = document.getElementById("ordersBody");
  tbody.innerHTML = "";
  orders.forEach((order) => {
    const sum = order.products.reduce(
      (acc, item) =>
        acc +
        (item.product && item.product.price
          ? item.product.price * item.quantity
          : 0),
      0,
    );
    const tr = document.createElement("tr");
    tr.className = "admin-order-row";
    tr.onclick = () => showOrderDetails(order);
    tr.innerHTML = `
      <td>${order._id.slice(-4)}</td>
      <td>${order.user ? order.user.username : "-"}</td>
      <td>${order.user ? order.user.email : "-"}</td>
      <td>${order.createdAt ? new Date(order.createdAt).toLocaleDateString("ru-RU") : ""}</td>
      <td><span class="admin-status ${order.status}">${statusLabel(order.status)}</span></td>
      <td>${sum} ₽</td>
    `;
    tbody.appendChild(tr);
  });
}

function showOrderDetails(order) {
  const details = document.getElementById("orderDetails");
  let productsList = "<ul class='admin-order-products'>";
  order.products.forEach((item) => {
    if (item.product && item.product.name) {
      productsList += `<li>${item.product.name} <span style='color:#888;'>x${item.quantity}</span></li>`;
    }
  });
  productsList += "</ul>";
  let statusBtns = "";
  if (order.status === "pending") {
    statusBtns += `<button class='admin-status-btn' onclick='updateStatus("${order._id}","shipped")'>В путь</button>`;
  }
  if (order.status === "shipped") {
    statusBtns += `<button class='admin-status-btn' onclick='updateStatus("${order._id}","delivered")'>Доставлен</button>`;
  }
  details.innerHTML = `
    <div class='admin-order-details'>
      <div class='admin-order-details-title'>Заказ #${order._id.slice(-4)}</div>
      <div><b>Пользователь:</b> ${order.user ? order.user.username : "-"} (${order.user ? order.user.email : "-"})</div>
      <div><b>Дата:</b> ${order.createdAt ? new Date(order.createdAt).toLocaleDateString("ru-RU") : ""}</div>
      <div><b>Статус:</b> <span class="admin-status ${order.status}">${statusLabel(order.status)}</span></div>
      <div><b>Товары:</b> ${productsList}</div>
      <div><b>Сумма:</b> ${order.products.reduce((acc, item) => acc + (item.product && item.product.price ? item.product.price * item.quantity : 0), 0)} ₽</div>
      <div style='margin-top:16px;'>${statusBtns}</div>
      <div style='margin-top:8px;'><button class='admin-status-btn' onclick='closeOrderDetails()'>Закрыть</button></div>
    </div>
  `;
}

function closeOrderDetails() {
  document.getElementById("orderDetails").innerHTML = "";
  loadOrders();
}

async function updateStatus(orderId, status) {
  const token = getToken();
  await fetch(`/api/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ status }),
  });
  closeOrderDetails();
}

window.onload = loadOrders;
