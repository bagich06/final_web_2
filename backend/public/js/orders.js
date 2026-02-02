const token = localStorage.getItem("token");

async function loadOrders() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login.html";
    return;
  }
  const res = await fetch("/api/orders", {
    headers: { Authorization: "Bearer " + token },
  });
  if (!res.ok) {
    document.getElementById("myOrders").innerText = "Ошибка загрузки заказов";
    return;
  }
  const orders = await res.json();
  let html = "";
  orders.forEach((order) => {
    html += `<div>Заказ #${order._id} (${order.status})<ul>`;
    order.products.forEach((item) => {
      html += `<li>${item.product.name} x${item.quantity}</li>`;
    });
    html += "</ul></div>";
  });
  document.getElementById("myOrders").innerHTML = html;
}

loadOrders();
