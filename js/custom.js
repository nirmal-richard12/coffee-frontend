document.addEventListener("DOMContentLoaded", () => {
  fetch("https://coffee-backend-wkng.onrender.com/api/products")
    .then(res => res.json())
    .then(data => {
      displayProducts(data);

      // ✅ VERY IMPORTANT
      highlightWishlist();  
    })
    .catch(err => console.log(err));

  updateCartCount(); 
  updateWishlistCount();
});

function displayProducts(products) {
  const container = document.getElementById("product-list");
  console.log(container); 
  container.innerHTML = "";
  products = products.sort(() => 0.5 - Math.random()).slice(0, 12);

  products.forEach(product => {
    const item = `
      <div class="col-md-6 col-lg-3">
        <div class="product">
          <a href="shop.html?category=${encodeURIComponent(product.category)}" class="img-prod">
            <img class="img-fluid" style="height:200px;object-fit:cover;" src="${product.image || 'images/product-1.jpg'}">
            <div class="overlay"></div>
            
          </a>
          <div class="text py-3 pb-4 px-3 text-center">
            <h3>
  <a href="shop.html?category=${encodeURIComponent(product.category)}">
    ${product.name}
  </a>
</h3>

            <div class="d-flex">
              <div class="pricing">
                <p class="price">
                  <span>₹${product.price}</span>
                </p>
              </div>
            </div>
            <div class="bottom-area d-flex px-3">
              <div class="m-auto d-flex">
                <a href="javascript:void(0)" onclick='addToCart(${JSON.stringify(product)})'
                  class="buy-now d-flex justify-content-center align-items-center mx-1">
                  <span><i class="ion-ios-cart"></i></span>
                </a>
                <a href="javascript:void(0)" 
                  onclick='addToWishlist(${JSON.stringify(product)}, this)'
                  class="heart d-flex justify-content-center align-items-center"
                  data-id="${product.id}">
                  <span><i class="ion-ios-heart"></i></span>
                </a>
                <a href="javascript:void(0)"
                  onclick='buyNow(${JSON.stringify(product)})'
                  class="buy-now buy-now-icon d-flex justify-content-center align-items-center mx-1">

                    <span>🛍️</span>

                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
    container.innerHTML += item;
});

highlightWishlist(); // ✅ ADD HERE ALSO
}
// TEMP FUNCTIONS
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const index = cart.findIndex(item => item.id === product.id);

  if (index !== -1) {
    cart[index].quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();

  // ✅ NEW
  showSlideToast(product.name + " added to cart");

  // ✅ animate cart
  animateCart();
}
  function buyNow(product) {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const exists = cart.find(item => item.id === product.id);

  if (!exists) {

    product.quantity = 1;

    product.buyNowTemp = true;

    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  window.location.href = "cart.html";
}

function addToWishlist(product, element) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  const index = wishlist.findIndex(item => item.id === product.id);

  if (index !== -1) {
    showSlideToast("Already in wishlist");
    element.classList.add("active");
  } else {
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    showSlideToast(product.name + " added to wishlist");

    element.classList.add("active");
    updateWishlistCount();
  }
  

} 
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let count = 0;

  cart.forEach(item => {
    count += item.quantity || 1;
  });

  const cartEl = document.getElementById("cart-count");
if (cartEl) {
  cartEl.innerText = count;
}
}
function showToast(message) {
  const toast = document.getElementById("toast");

  toast.innerText = message;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}
function animateCart() {
  const cartIcon = document.querySelector(".icon-shopping_cart");

  if (cartIcon) {
    cartIcon.classList.add("cart-bounce");

    setTimeout(() => {
      cartIcon.classList.remove("cart-bounce");
    }, 400);
  }
}function showSlideToast(message) {
  const toast = document.getElementById("slide-toast");

  toast.innerText = "✔ " + message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
function highlightWishlist() {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  wishlist.forEach(item => {
    const btn = document.querySelector(`.heart[data-id="${item.id}"]`);
    if (btn) {
      btn.classList.add("active");
    }
  });
}
function updateWishlistCount() {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  const el = document.getElementById("wishlist-count");
  if (el) {
    el.innerText = wishlist.length;
  }
}