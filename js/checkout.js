document.addEventListener("DOMContentLoaded", () => {
  renderCheckoutItems();
  updateCheckoutTotals();
  updateCartTotals();
  updateCartCount();
  updateWishlistCount();
});

// 🔹 Update totals in checkout page
function updateCheckoutTotals() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * (item.quantity || 1);
  });

  let delivery = 0;
  let discount = 0;
  let total = subtotal - discount + delivery;

  // update UI
  document.getElementById("checkout-subtotal").innerText = "₹" + subtotal;
  document.getElementById("checkout-delivery").innerText = "₹" + delivery;
  document.getElementById("checkout-discount").innerText = "₹" + discount;
  document.getElementById("checkout-total").innerText = "₹" + total;
}

// 🔹 Place Order
function placeOrder() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  let confirmPayment = confirm("Proceed to payment?");

  if (confirmPayment) {

  // ✅ SAVE ORDER
  localStorage.setItem("lastOrder", JSON.stringify(cart));

  // ✅ CLEAR CART
  localStorage.removeItem("cart");

  // ✅ SUCCESS MESSAGE
  alert("Payment successful!");

  // ✅ AFTER OK CLICK -> GO TO SUCCESS PAGE
  window.location.href = "order-success.html";
}
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
function renderCheckoutItems() {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const container = document.getElementById("checkout-items");

  if (!container) return;

  container.innerHTML = "";

  cart.forEach(item => {

    container.innerHTML += `

      <div class="checkout-item">

        <img src="${item.image}" class="checkout-item-img">

        <div>
          <h6>${item.name}</h6>
          <p>Qty: ${item.quantity || 1}</p>
        </div>

      </div>

    `;
  });
}

document.getElementById("pincode").addEventListener("keyup", async function () {

    let pin = this.value;

    if(pin.length === 6){

        let response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);

        let data = await response.json();

        if(data[0].Status === "Success"){

            let post = data[0].PostOffice[0];

            document.getElementById("city").value = post.District;

            document.getElementById("state").value = post.State;
        }
    }
});
