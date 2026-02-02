async function loadProducts() {
  try {
    const res = await fetch("/api/products");
    if (!res.ok) {
      throw new Error("Ошибка API: " + res.status + " " + (await res.text()));
    }
    const products = await res.json();
    const container = document.getElementById("products");
    const count = document.getElementById("catalogCount");
    container.innerHTML = "";
    if (count)
      count.textContent = products.length ? products.length + " ТОВАРОВ" : "";
    if (!products.length) {
      container.innerHTML =
        '<div style="color:#888;font-size:1.2rem;">Нет товаров</div>';
      return;
    }
    products.forEach((product) => {
      const div = document.createElement("div");
      div.className = "product-card";
      div.innerHTML = `
        <img class="product-img" src="${product.image || "https://placehold.co/400x400?text=No+Image"}" alt="${product.name}">
        <div class="product-info">
          <div class="product-title">${product.name}</div>
          <div class="product-desc">${product.description || ""}</div>
          <div class="product-bottom">
            <span class="product-price">${product.price} ₽</span>
            <button class="product-add" data-id="${product._id}">+</button>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
    // Навешиваем обработчики на кнопки
    document.querySelectorAll(".product-add").forEach((btn) => {
      btn.onclick = function () {
        addToCart(this.getAttribute("data-id"));
      };
    });
  } catch (e) {
    const container = document.getElementById("products");
    container.innerHTML =
      '<div style="color:#d00;font-size:1.1rem;">Ошибка: ' +
      e.message +
      "</div>";
  }
}

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const idx = cart.findIndex((item) => item.product === productId);
  if (idx > -1) cart[idx].quantity++;
  else cart.push({ product: productId, quantity: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Товар добавлен в корзину!");
}

loadProducts();
