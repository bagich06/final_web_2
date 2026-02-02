const token = localStorage.getItem("token");

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const container = document.getElementById("cartItems");
  const sumElem = document.getElementById("cartSum");
  const totalElem = document.getElementById("cartTotal");
  if (!cart.length) {
    container.innerHTML = "<p>Корзина пуста</p>";
    if (sumElem) sumElem.textContent = "0 ₽";
    if (totalElem) totalElem.textContent = "0 ₽";
    return;
  }
  fetch("/api/products")
    .then((res) => res.json())
    .then((products) => {
      container.innerHTML = "";
      let sum = 0;
      cart.forEach((item) => {
        const product = products.find((p) => p._id === item.product);
        if (product) {
          const div = document.createElement("div");
          div.className = "cart-item";
          div.innerHTML = `
            <img class="cart-item-img" src="${product.image || "/uploads/no-image.png"}" alt="${product.name}">
            <div class="cart-item-info">
              <div class="cart-item-title">${product.name}</div>
              <div class="cart-item-desc">${product.description || ""}</div>
              <div class="cart-item-qty">Количество: ${item.quantity}</div>
              <button class="cart-item-remove" onclick="removeFromCart('${item.product}')">Удалить</button>
            </div>
            <div class="cart-item-price">${product.price * item.quantity} ₽</div>
          `;
          container.appendChild(div);
          sum += product.price * item.quantity;
        }
      });
      if (sumElem) sumElem.textContent = sum + " ₽";
      if (totalElem) totalElem.textContent = sum + " ₽";
    });
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart = cart.filter((item) => item.product !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

document.getElementById("checkoutBtn").onclick = async function () {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (!cart.length) return;
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/register.html";
    return;
  }
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ products: cart }),
  });
  if (res.ok) {
    localStorage.removeItem("cart");
    document.getElementById("cartMessage").innerText = "Заказ оформлен!";
    renderCart();
  } else {
    document.getElementById("cartMessage").innerText =
      "Ошибка оформления заказа";
  }
};

renderCart();
