document.addEventListener("DOMContentLoaded", () => {
 renderWishlist();

  updateCartCount();

  updateWishlistCount();
});

function renderWishlist() {

  let wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

  const container =
    document.getElementById("wishlist-items");

  container.innerHTML = "";

  // EMPTY STATE
  if (wishlist.length === 0) {

    container.innerHTML = `
      <div class="empty-wishlist">
        <img src="images/coffee-empty.png" class="empty-img">

        <h2>Your Coffee Wishlist is Empty ☕</h2>

        <p>
          Save your favorite brews and discover
          your next cozy moment.
        </p>

        <a href="shop.html" class="browse-btn">
          Explore Coffee
        </a>
      </div>
    `;

    return;
  }

  wishlist.forEach((item, index) => {

    const card = `

<div class="premium-wish-card">

  <button class="premium-remove-wish-btn"
    onclick="removeWishlist(${index})">
    ✖
  </button>

  <img src="${item.image}" alt="${item.name}">

  <div class="premium-wishlist-content">

    <h3>${item.name}</h3>

    
 <p class="premium-wishlist-price">
      ₹${item.price}
    </p>

    <div class="premium-wishlist-buttons">

      <button class="premium-cart-wish-btn"
        onclick='addToCart(${JSON.stringify(item)})'>

        Add To Cart 🛒

      </button>

    </div>

  </div>

</div>

`;

    container.innerHTML += card;
  });
}

function removeWishlist(index) {

  let wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

  wishlist.splice(index, 1);

  localStorage.setItem(
    "wishlist",
    JSON.stringify(wishlist)
  );

  renderWishlist();
}

function addToCart(product) {

  let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  cart.push(product);

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  function addToCart(product) {

  let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  cart.push(product);

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  updateCartCount();

  showToast(`${product.name} added to cart ☕`);
}
}
function showToast(message) {

  const toast = document.createElement("div");

  toast.className = "coffee-toast";

  toast.innerHTML = `
    <span>☕</span>
    ${message}
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {

    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 400);

  }, 2500);
}
function updateCartCount() {

  const cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  const cartCount =
    document.getElementById("cart-count");

  if(cartCount){
    cartCount.innerText = cart.length;
  }
}

function updateWishlistCount() {

  const wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

  const wishlistCount =
    document.getElementById("wishlist-count");

  if(wishlistCount){
    wishlistCount.innerText = wishlist.length;
  }
}