let allProducts = [];

document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  const searchFromHome = params.get("search");
  const categoryFromHome = params.get("category");

  // 🔥 FETCH PRODUCTS
  fetch("https://coffee-backend-wkng.onrender.com/api/products")
    .then(res => res.json())
    .then(data => {
      allProducts = data;

      const input = document.getElementById("shopSearch");

      // 🔍 SEARCH FROM HOME
      if (searchFromHome) {
        if (input) input.value = searchFromHome;
        filterProducts();
      }

      // 🟡 CATEGORY FROM HOME
      else if (categoryFromHome) {

        document.querySelectorAll(".shopx-tabs a").forEach(tab => {
          tab.classList.remove("active");

          if (tab.dataset.filter === categoryFromHome) {
            tab.classList.add("active");
          }
        });

        filterProducts();
      }

      // 🔵 DEFAULT LOAD
      else {
        displayProducts(data);
      }

      highlightWishlist();
      updateCartCount();
      updateWishlistCount();
    })
    .catch(err => console.log(err));


  // 🔍 SEARCH INPUT
  const searchInput = document.getElementById("shopSearch");

  if (searchInput) {

    searchInput.addEventListener("input", (e) => {
      showSuggestions(e.target.value.toLowerCase());
    });

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        filterProducts();
      }
    });
  }


  // 🔘 SEARCH BUTTON
  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", filterProducts);
  }


  // 📂 CATEGORY CLICK
  document.querySelectorAll(".shopx-tabs a").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      document.querySelectorAll(".shopx-tabs a").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      filterProducts();
    });
  });


  // ❌ CLOSE SUGGESTIONS
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".shop-search-wrap")) {
      const box = document.getElementById("searchSuggestions");
      if (box) box.style.display = "none";
    }
  });

});


// 🔍 FILTER PRODUCTS
function filterProducts() {

  const search = document.getElementById("shopSearch")?.value.toLowerCase() || "";

  const activeTab = document.querySelector(".shopx-tabs a.active");
  const category = activeTab ? activeTab.dataset.filter : "all";

  let filtered = allProducts.filter(p => {

    const name = p.name?.toLowerCase() || "";
    const cat = p.category?.toLowerCase() || "";
    const sub = p.subcategory?.toLowerCase() || "";

    return (
      (
        name.includes(search) ||
        cat.includes(search) ||
        sub.includes(search) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(search)))
      )
      &&
      (category === "all" || p.category === category)
    );
  });

  displayProducts(filtered);
  highlightWishlist();
}


// 💡 SEARCH SUGGESTIONS
function showSuggestions(keyword) {

  const box = document.getElementById("searchSuggestions");
  if (!box) return;

  if (!keyword) {
    box.style.display = "none";
    return;
  }

  const matches = allProducts.filter(p =>
    p.name.toLowerCase().includes(keyword) ||
    p.category.toLowerCase().includes(keyword)
  );

  if (matches.length === 0) {
    box.style.display = "none";
    return;
  }

  box.innerHTML = "";

  matches.slice(0, 5).forEach(p => {
    box.innerHTML += `
      <div class="search-item" onclick="selectSuggestion('${p.name}')">
        ${p.name}
      </div>
    `;
  });

  box.style.display = "block";
}


// ✅ SELECT SUGGESTION
function selectSuggestion(name) {
  document.getElementById("shopSearch").value = name;
  document.getElementById("searchSuggestions").style.display = "none";
  filterProducts(); // 🔥 IMPORTANT FIX
}


// 🛒 DISPLAY PRODUCTS
function displayProducts(products) {

  const container = document.getElementById("shopProducts");
  if (!container) return;

  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = `<p style="text-align:center;">No products found</p>`;
    return;
  }

  products.forEach(p => {
    container.innerHTML += `
      <div class="col-md-6 col-lg-3 mb-4">
        <div class="shop-card">

          <div class="shop-img">
            <img src="${p.image}" alt="${p.name}">
          </div>

          <div class="shop-info">
            <h4>${p.name}</h4>
            <p class="price">₹${p.price}</p>

            <div class="shop-actions">
              <button onclick='addToCart(${JSON.stringify(p)})'>🛒</button>
              <button onclick='buyNow(${JSON.stringify(p)})'>🛍️</button>
              <button onclick='addToWishlist(${JSON.stringify(p)}, this)'>❤️</button>
            </div>

          </div>

        </div>
      </div>
    `;
  });
}


// 🛒 ADD TO CART
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
  showToast(product.name + " added to cart 🛒");
}


// ❤️ ADD TO WISHLIST
function addToWishlist(product, el) {

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  const exists = wishlist.find(item => item.id === product.id);

  if (exists) {
    showToast("Already in wishlist ❤️");
    return;
  }

  wishlist.push(product);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  el.classList.add("active");

  updateWishlistCount();
  showToast(product.name + " added to wishlist ❤️");
}


// 🔢 CART COUNT
function updateCartCount() {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let count = 0;
  cart.forEach(item => count += item.quantity || 1);

  const el = document.getElementById("cart-count");
  if (el) el.innerText = count;
}


// 🔢 WISHLIST COUNT
function updateWishlistCount() {

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  const el = document.getElementById("wishlist-count");
  if (el) el.innerText = wishlist.length;
}


// ❤️ HIGHLIGHT
function highlightWishlist() {

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  wishlist.forEach(item => {
    const btn = document.querySelector(`button[data-id="${item.id}"]`);
    if (btn) btn.classList.add("active");
  });
}


// 🔔 TOAST
function showToast(message) {

  const toast = document.getElementById("slide-toast");
  if (!toast) return;

  toast.innerText = "✔ " + message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
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