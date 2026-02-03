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
    // Автозаполнение формы
    if (document.getElementById("editUsername"))
      document.getElementById("editUsername").value = user.username;
    if (document.getElementById("editEmail"))
      document.getElementById("editEmail").value = user.email;

    // Загрузка истории заказов
    const ordersRes = await fetch("/api/users/orders", {
      headers: { Authorization: "Bearer " + token },
    });
    let orders = await ordersRes.json();
    if (!Array.isArray(orders)) orders = [];
    let html = "";
    function statusLabel(status) {
      if (status === "pending") return "Ожидает";
      if (status === "shipped") return "В пути";
      if (status === "delivered") return "ДОСТАВЛЕН";
      return status;
    }
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
            productsList += `<li>${item.product.name} <span style=\"color:#888;\">x${item.quantity}</span></li>`;
          }
        });
        productsList += "</ul>";
      }
      let deleteBtn = "";
      let editBtn = "";
      if (order.status === "pending") {
        deleteBtn = `<button class='order-delete-btn' data-id='${order._id}' style="margin-top:10px;padding:6px 18px;background:#d00;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:700;">Удалить</button>`;
        editBtn = `<button class='order-edit-btn' data-id='${order._id}' style="margin-top:10px;margin-left:10px;padding:6px 18px;background:#007bff;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:700;">Изменить</button>`;
      }
      html += `<div class=\"order-card\">\n
        <div class=\"order-info\">\n
          <div class=\"order-id\">ORD-${order._id.toString().slice(-4)}\n
            <span class=\"order-status ${order.status}\">\n
              ${statusLabel(order.status)}\n
            </span>\n
          </div>\n
          <div class=\"order-date\">от ${order.createdAt ? new Date(order.createdAt).toLocaleDateString("ru-RU") : ""}</div>\n
          <div class=\"order-count\">${count} товар${count === 1 ? "" : "а"}</div>\n
          ${productsList}
          <div style=\"display:flex;gap:8px;\">${deleteBtn}${editBtn}</div>
        </div>\n
        <div class=\"order-sum\">${sum} ₽</div>\n
      </div>`;
    });
    document.getElementById("orderHistory").innerHTML = html;

    // Навесить обработчик на кнопки удаления
    document.querySelectorAll(".order-delete-btn").forEach((btn) => {
      btn.onclick = async function () {
        if (!confirm("Удалить этот заказ?")) return;
        const orderId = btn.getAttribute("data-id");
        try {
          const delRes = await fetch(`/api/users/orders/${orderId}`, {
            method: "DELETE",
            headers: { Authorization: "Bearer " + token },
          });
          if (!delRes.ok) {
            const data = await delRes.json();
            alert(data.message || "Ошибка удаления");
          } else {
            loadProfile();
          }
        } catch (e) {
          alert("Ошибка сети");
        }
      };
    });

    // Навесить обработчик на кнопки изменения
    document.querySelectorAll(".order-edit-btn").forEach((btn) => {
      btn.onclick = function () {
        const orderId = btn.getAttribute("data-id");
        const order = orders.find((o) => o._id === orderId);
        if (!order) return;
        // Открыть простую форму для изменения количества товаров
        let formHtml = `<form id='orderEditForm' style='margin-top:12px;'>`;
        order.products.forEach((item, idx) => {
          formHtml += `<div style='margin-bottom:8px;'>${item.product && item.product.name ? item.product.name : "Товар"} <input type='number' min='1' value='${item.quantity}' data-idx='${idx}' style='width:60px;padding:4px 8px;margin-left:8px;border-radius:4px;border:1px solid #ccc;' /></div>`;
        });
        formHtml += `<button type='submit' style='padding:6px 18px;background:#007bff;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:700;'>Сохранить</button> <button type='button' id='orderEditCancel' style='padding:6px 18px;background:#888;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:700;margin-left:8px;'>Отмена</button>`;
        formHtml += `</form>`;
        // Вставить форму после order-card
        const card = btn.closest('.order-card');
        if (!card) return;
        // Удалить старую форму если есть
        const oldForm = card.querySelector('#orderEditForm');
        if (oldForm) oldForm.remove();
        card.insertAdjacentHTML('beforeend', formHtml);
        // Обработчик отмены
        card.querySelector('#orderEditCancel').onclick = function() {
          card.querySelector('#orderEditForm').remove();
        };
        // Обработчик сохранения
        card.querySelector('#orderEditForm').onsubmit = async function(e) {
          e.preventDefault();
          const newProducts = order.products.map((item, idx) => {
            const input = card.querySelector(`input[data-idx='${idx}']`);
            return {
              product: item.product && item.product._id ? item.product._id : item.product,
              quantity: parseInt(input.value) || 1
            };
          });
          try {
            const res = await fetch(`/api/users/orders/${orderId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
              },
              body: JSON.stringify({ products: newProducts })
            });
            if (!res.ok) {
              const data = await res.json();
              alert(data.message || 'Ошибка изменения заказа');
            } else {
              loadProfile();
            }
          } catch (e) {
            alert('Ошибка сети');
          }
        };
      };
    });
  } catch (e) {
    window.location.href = "/login.html";
  }
}

// Обработка отправки формы редактирования профиля
document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = function () {
      localStorage.removeItem("token");
      window.location.href = "/login.html";
    };
  }
  const form = document.getElementById("profileEditForm");
  if (form) {
    form.onsubmit = async function (e) {
      e.preventDefault();
      const token = localStorage.getItem("token");
      const username = document.getElementById("editUsername").value.trim();
      const email = document.getElementById("editEmail").value.trim();
      const password = document.getElementById("editPassword").value;
      const msg = document.getElementById("profileEditMsg");
      msg.textContent = "";
      try {
        const res = await fetch("/api/users/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ username, email, password }),
        });
        if (!res.ok) {
          const data = await res.json();
          msg.textContent =
            data.message ||
            (data.errors && data.errors[0] && data.errors[0].msg) ||
            "Ошибка";
          msg.style.color = "#d00";
        } else {
          msg.textContent = "Профиль обновлен";
          msg.style.color = "#2e8b57";
          loadProfile();
        }
      } catch (err) {
        msg.textContent = "Ошибка сети";
        msg.style.color = "#d00";
      }
    };
  }
  loadProfile();
});
