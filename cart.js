let cart = [];
const CART_KEY = "dessert_cart";

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function loadCart() {
  const stored = localStorage.getItem(CART_KEY);
  if (stored) {
    cart = JSON.parse(stored);
  }
}

loadCart();

const cartContainer = document.getElementById('cart');

const mycart = document.createElement('div');
mycart.className = 'myCart';

const cartItems = document.createElement('div');
cartItems.className = 'cart-items';

mycart.innerHTML = `
  <h1 class="cart-heading">
    Your Cart (<span class="cartCount">0</span>)
  </h1>

  <div class="empty-cart">
  <img src="../assets/images/illustration-empty-cart.svg">
  <p>Your added items will appear here</p>  
  </div>

  <div class="order-total  hidden">
    <p class="opacity-80">Order Total</p>
    <p class="font-extrabold text-2xl text-black">$<span class="cartTotal">0.00</span></p>
  </div>

  <div class="delivery hidden">
    <img src="../assets/images/icon-carbon-neutral.svg" class="carbon-icon">
    <p>This is a <span>carbon-neutral</span> delivery</p>
  </div>

  <button class="confirm-btn hidden">Confirm Order</button>
`;

mycart.insertBefore(cartItems, mycart.querySelector('.order-total'));
cartContainer.appendChild(mycart);


function updateCartLayout() {
  const emptyCart = mycart.querySelector('.empty-cart');
  const orderTotal = mycart.querySelector('.order-total');
  const delivery = mycart.querySelector('.delivery');
  const confirmBtn = mycart.querySelector('.confirm-btn');

  const isEmpty = cart.length === 0;

  emptyCart.classList.toggle('hidden', !isEmpty);
  orderTotal.classList.toggle('hidden', isEmpty);
  delivery.classList.toggle('hidden', isEmpty);
  confirmBtn.classList.toggle('hidden', isEmpty);
}

updateCartLayout();

function getProductFromCard(card) {
  return {
    name: card.querySelector('.card-title').textContent,
    price: Number(card.querySelector('.card-price').textContent.replace('$', '')),
    image: card.querySelector('.image').src
  };
}


function updateCardUI(card) {
  const { name } = getProductFromCard(card);
  const btn = card.querySelector('.card-btn');
  const countEl = card.querySelector('.count');
  const image = card.querySelector('.image');

  const item = cart.find(i => i.name === name);

  if (!item) {
    countEl.textContent = 0;
    btn.classList.remove('active');
    image.classList.remove('active');
    return;
  }

  countEl.textContent = item.qty;
  btn.classList.add('active');
  image.classList.add('active');
}

function updateCartSummary() {
  const cartCountEl = document.querySelector('.cartCount');
  const cartTotalEl = document.querySelector('.cartTotal');

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    totalItems += item.qty;
    totalPrice += item.qty * item.price;
  });

  cartCountEl.textContent = totalItems;
  cartTotalEl.textContent = totalPrice.toFixed(2);
}

function updateCartItems() {
  cartItems.innerHTML = '';

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'justify-between';

    div.innerHTML = `
      <div class="inner">

        <div class="flex justify-between">
            <p class="font-semibold">${item.name}</p>
            <button class="remove-btn " data-name="${item.name}">
            <img src="../assets/images/icon-remove-item.svg" class="w-5 h-5 opacity-70 border rounded-full">
            </button>
        </div>

        <div class="flex flex-row gap-4">
            <p class=""><span class="text-R font-bold pr-5">${item.qty}x</span> <span class="opacity-50"> @ $${item.price}</span></p>
            <p class="flex gap-2 font-semibold opacity-50">$${(item.qty * item.price).toFixed(2)}</p>
        </div>

     </div>
    `;

    cartItems.appendChild(div);
  });
}

document.addEventListener('click', (e) => {
  const card = e.target.closest('.card');

  //Remove from cart
  if (e.target.closest('.remove-btn')) {
    const name = e.target.closest('.remove-btn').dataset.name;
    cart = cart.filter(item => item.name !== name);
    saveCart();

    updateCartItems();
    updateCartSummary();
    updateCartLayout();


    document.querySelectorAll('.card').forEach(updateCardUI);
    return;
  }

  if (!card) return;

  const { name, price, image } = getProductFromCard(card);

  // increment
  if (e.target.classList.contains('increment')) {
    let item = cart.find(i => i.name === name);
    if (item) item.qty++;
    else cart.push({ name, price, image, qty: 1 });
    saveCart();


    updateCardUI(card);
    updateCartItems();
    updateCartSummary();
    updateCartLayout();

    return;
  }

  //decrement
  if (e.target.classList.contains('decrement')) {
    let item = cart.find(i => i.name === name);
    if (!item) return;

    item.qty--;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.name !== name);
    }

    saveCart();

    updateCardUI(card);
    updateCartItems();
    updateCartSummary();
    updateCartLayout();

    return;
  }

  //add to cart button
  const cardBtn = e.target.closest('.card-btn');
  
  if (!cardBtn) return;

  let item = cart.find(i => i.name === name);
  
  if (item) item.qty++;
  else cart.push({ name, price, image, qty: 1 });

  saveCart();
  updateCardUI(card);
  updateCartItems();
  updateCartSummary();
  updateCartLayout();
});

// Select the confirm container and confirm button
const confirmContainer = document.getElementById('confirmContainer');
const confirmBtn = document.querySelector('.confirm-btn');

// Handle click on Confirm Order
confirmBtn.addEventListener('click', () => {

  window.scrollTo({ top: 0, behavior: 'instant' });

  document.body.classList.add('no-scroll');

  confirmBackdrop.classList.remove('hidden');
  confirmContainer.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  if (cart.length === 0) return;
  confirmContainer.innerHTML = '';

  // Create the confirmation wrapper
  const confirmation = document.createElement('div');
  confirmation.className = 'confirmation p-6 rounded-xl shadow space-y-6 bg-white';

  // Build the HTML for cart items (with image)
  const itemsHTML = cart
    .map(item => `
      <div class="flex items-center justify-between py-3">
        <div class="flex items-center gap-4">
          <img src="${item.image}" class="w-12 h-12 rounded-md" alt="${item.name}" />
          <div>
            <p class="font-semibold">${item.name}</p>
            <p class="text-sm"><span class="text-R pr-4 font-bold">${item.qty}x</span> @ $${item.price}</p>
          </div>
        </div>
        <p class="font-semibold">$${(item.qty * item.price).toFixed(2)}</p>
      </div>
    `)
    .join('');

  
  confirmation.innerHTML = `
    <div class="space-y-4">
      <img src="../assets/images/icon-order-confirmed.svg" class="w-16 h-16" />
      <h1 class="text-5xl font-bold">Order <br> Confirmed</h1>
      <p class="opacity-70">We hope you enjoyed your food!</p>
    </div>

    <div class="mt-6 border-b border-gray-300 shadow-lg rounded-b-lg shadow-white">
      ${itemsHTML}
    </div>

    <div class="flex justify-between text-xl mt-6">
      <p class="opacity-80">Order Total</p>
      <p class="font-bold">$${calculateTotal()}</p>
    </div>

    <button class="order-confirmed-btn mt-6 w-full bg-R text-white py-3 rounded-4xl">
      Start New Order
    </button>
  `;


  confirmContainer.appendChild(confirmation);

  
  const startNewBtn = confirmation.querySelector('.order-confirmed-btn');
  startNewBtn.addEventListener('click', () => {
    confirmBackdrop.classList.add('hidden');
    confirmContainer.classList.add('hidden');
    document.body.style.overflow = '';

     document.body.classList.remove('no-scroll');
    cart = []; 
    saveCart();

    updateCartItems(); 
    updateCartSummary();
    updateCartLayout();
    confirmContainer.innerHTML = '';
  });
});

function calculateTotal() {
  return cart
    .reduce((sum, item) => sum + item.qty * item.price, 0)
    .toFixed(2);
}


