document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartTotals();
  updateCartCount();
  updateWishlistCount();
});

// 🔹 Render Cart Items
function renderCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const container = document.getElementById("cart-items");
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="6">Cart is empty</td>
      </tr>
    `;
    return;
  }

  cart.forEach((item, index) => {
    let quantity = item.quantity || 1;
    let itemTotal = item.price * quantity;

    const row = `
      <tr class="text-center cart-row">
        <td>
          <button class="remove-btn" onclick="removeItem(${index})">
  <i class="ion-ios-close"></i>
</button>
        </td>

        <td>
          <img src="${item.image}" style="width:110px;height:90px;object-fit:cover;border-radius:12px;">
        </td>

        <td>${item.name}</td>

        <td>₹${item.price}</td>

        <td>
          <div class="qty-box">
  <button class="qty-btn" onclick="decreaseQty(${index})">−</button>

  <span class="qty-number">${quantity}</span>

  <button class="qty-btn" onclick="increaseQty(${index})">+</button>
</div>
        </td>

        <td>₹${itemTotal}</td>
      </tr>
    `;

    container.innerHTML += row;
  });

  updateCartTotals(); // 🔥 IMPORTANT
}

// ➕ Increase Quantity
function increaseQty(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart[index].quantity = (cart[index].quantity || 1) + 1;

  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();
    updateCartCount(); 
}

// ➖ Decrease Quantity
function decreaseQty(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if ((cart[index].quantity || 1) > 1) {
    cart[index].quantity -= 1;
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();
    updateCartCount(); 
}

// ❌ Remove Item
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();
    updateCartCount(); 
}

// 🔹 Update Totals
function updateCartTotals() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * (item.quantity || 1);
  });

  let delivery = 0;
  let discount = 0;
  let total = subtotal - discount + delivery;

  document.getElementById("subtotal").innerText = "₹" + subtotal;
  document.getElementById("delivery").innerText = "₹" + delivery;
  document.getElementById("discount").innerText = "₹" + discount;
  document.getElementById("total").innerText = "₹" + total;
}


// ❤️ HIGHLIGHT
function highlightWishlist() {

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  wishlist.forEach(item => {
    const btn = document.querySelector(`button[data-id="${item.id}"]`);
    if (btn) btn.classList.add("active");
  });
}
// CART COUNT
function updateCartCount() {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let count = 0;

  cart.forEach(item => {
    count += item.quantity || 1;
  });

  const el = document.getElementById("cart-count");

  if (el) {
    el.innerText = count;
  }
}

// WISHLIST COUNT
function updateWishlistCount() {

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  const el = document.getElementById("wishlist-count");

  if (el) {
    el.innerText = wishlist.length;
  }
}
window.addEventListener("beforeunload", () => {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart = cart.filter(item => !item.buyNowTemp);

  localStorage.setItem("cart", JSON.stringify(cart));
});