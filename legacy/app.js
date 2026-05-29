const TAX_RATE = 0.12;

const products = [
  {
    id: "p1",
    name: "Native Coffee Beans (250g)",
    price: 220,
    image: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p2",
    name: "Coconut Sugar (500g)",
    price: 145,
    image: "https://images.unsplash.com/photo-1615486363973-cca4c8f9df45?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p3",
    name: "Turmeric Powder (200g)",
    price: 130,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p4",
    name: "Banana Chips (100g)",
    price: 75,
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p5",
    name: "Cassava Crackers (150g)",
    price: 95,
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p6",
    name: "Tablea Cacao (10pcs)",
    price: 180,
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80"
  }
];

const cart = new Map();
const sales = [];

const productListEl = document.getElementById("product-list");
const cartItemsEl = document.getElementById("cart-items");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const checkoutFormEl = document.getElementById("checkout-form");
const cashInputEl = document.getElementById("cash");
const receiptEl = document.getElementById("receipt");
const txnCountEl = document.getElementById("txn-count");
const dailyRevenueEl = document.getElementById("daily-revenue");
const salesLogEl = document.getElementById("sales-log");
const portfolioListEl = document.getElementById("portfolio-list");

function formatPHP(value) {
  return `PHP ${value.toFixed(2)}`;
}

function getCartTotals() {
  let subtotal = 0;
  for (const item of cart.values()) {
    subtotal += item.price * item.qty;
  }
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

function renderProducts() {
  productListEl.innerHTML = "";

  for (const product of products) {
    const item = document.createElement("div");
    item.className = "product-item";
    item.innerHTML = `
      <div>
        <strong>${product.name}</strong><br />
        <small>${formatPHP(product.price)}</small>
      </div>
      <button data-id="${product.id}">Add</button>
    `;
    productListEl.appendChild(item);
  }
}

function renderPortfolio() {
  portfolioListEl.innerHTML = "";

  for (const product of products) {
    const card = document.createElement("article");
    card.className = "portfolio-item";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      <div class="info">
        <strong>${product.name}</strong>
        <small>${formatPHP(product.price)}</small>
      </div>
    `;
    portfolioListEl.appendChild(card);
  }
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  if (!cart.has(productId)) {
    cart.set(productId, { ...product, qty: 1 });
  } else {
    cart.get(productId).qty += 1;
  }

  renderCart();
}

function updateQty(productId, delta) {
  if (!cart.has(productId)) return;
  const item = cart.get(productId);
  item.qty += delta;
  if (item.qty <= 0) {
    cart.delete(productId);
  }
  renderCart();
}

function renderCart() {
  cartItemsEl.innerHTML = "";

  if (cart.size === 0) {
    cartItemsEl.innerHTML = "<p>No items yet.</p>";
  } else {
    for (const item of cart.values()) {
      const row = document.createElement("div");
      row.className = "cart-row";
      row.innerHTML = `
        <span>${item.name}</span>
        <div class="qty-controls">
          <button data-action="dec" data-id="${item.id}">-</button>
          <button data-action="inc" data-id="${item.id}">+</button>
        </div>
        <span>x${item.qty}</span>
        <strong>${formatPHP(item.price * item.qty)}</strong>
      `;
      cartItemsEl.appendChild(row);
    }
  }

  const totals = getCartTotals();
  subtotalEl.textContent = formatPHP(totals.subtotal);
  taxEl.textContent = formatPHP(totals.tax);
  totalEl.textContent = formatPHP(totals.total);
}

function renderSales() {
  txnCountEl.textContent = String(sales.length);
  const revenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  dailyRevenueEl.textContent = formatPHP(revenue);

  salesLogEl.innerHTML = "";
  for (const sale of sales.slice().reverse()) {
    const li = document.createElement("li");
    li.textContent = `${sale.time} - ${sale.items} item(s) - ${formatPHP(sale.total)} (Change: ${formatPHP(sale.change)})`;
    salesLogEl.appendChild(li);
  }
}

function completeSale(cashValue) {
  const totals = getCartTotals();
  if (cart.size === 0) {
    alert("Cart is empty.");
    return;
  }

  if (Number.isNaN(cashValue) || cashValue < totals.total) {
    alert("Insufficient cash amount.");
    return;
  }

  const change = cashValue - totals.total;
  const itemsCount = Array.from(cart.values()).reduce((sum, i) => sum + i.qty, 0);
  const now = new Date();

  sales.push({
    time: now.toLocaleTimeString(),
    items: itemsCount,
    total: totals.total,
    change
  });

  receiptEl.classList.remove("hidden");
  receiptEl.innerHTML = `
    <strong>Sale Complete</strong><br />
    Total: ${formatPHP(totals.total)}<br />
    Cash: ${formatPHP(cashValue)}<br />
    Change: ${formatPHP(change)}
  `;

  cart.clear();
  cashInputEl.value = "";
  renderCart();
  renderSales();
}

productListEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;
  addToCart(target.dataset.id);
});

cartItemsEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;
  const action = target.dataset.action;
  const productId = target.dataset.id;
  if (!productId) return;
  updateQty(productId, action === "inc" ? 1 : -1);
});

checkoutFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  completeSale(parseFloat(cashInputEl.value));
});

renderProducts();
renderPortfolio();
renderCart();
renderSales();
