const productGrid = document.getElementById('productGrid');

async function loadProducts() {
  try {
    const response = await fetch("./data.json")
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const products = await response.json();


    products.forEach(product => {
  const card = document.createElement('div')
  card.className = "card";

  card.innerHTML = `
   <picture>
    <source media="(min-width: 1024px)" srcset="${product.image.desktop}">
    <source media="(min-width: 768px)" srcset="${product.image.tablet}">
    <img 
      src="${product.image.mobile}" 
      alt="${product.name}" 
      class=" image rounded-lg w-full object-cover h-auto"
    >
  </picture>
  <div class="flex justify-center">
  <button class="card-btn "> 
  <img src="assets/images/icon-decrement-quantity.svg" class="decrement">
   <span class="count">0</span> 
   <img src="assets/images/icon-add-to-cart.svg" class="cart-icon"> 
   <span class="add-to-cart">Add to Cart</span> 
   <img src="../assets/images/icon-increment-quantity.svg" class="increment">
   </button>
  </div>


  <p class="card-category">${product.category}</p>
  <h2 class="card-title">${product.name}</h2>
  <p class="card-price">$${product.price.toFixed(2)}</p>
  `;

  productGrid.appendChild(card);
});

loadCart();
updateCartItems();
updateCartSummary();
updateCartLayout();
document.querySelectorAll('.card').forEach(updateCardUI);

  } catch (error) {
  console.error(error);
}

}

loadProducts();
