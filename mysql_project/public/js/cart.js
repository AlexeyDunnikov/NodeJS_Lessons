let cart = {};

document.querySelectorAll(".add-to-cart").forEach((evt) => {
  evt.addEventListener("click", addToCart);
});

if(localStorage.getItem('cart')){
    cart = JSON.parse(localStorage.getItem('cart'));
    ajaxGetGoodsInfo();
}

function addToCart() {
  const goodsId = this.dataset.goods_id;
  if (cart[goodsId]) {
    cart[goodsId]++;
  } else {
    cart[goodsId] = 1;
  }

  ajaxGetGoodsInfo();
}

function ajaxGetGoodsInfo() {
  updateLocalStorageCart();
  fetch("/get-goods-info", {
    method: "POST",
    body: JSON.stringify({
      key: Object.keys(cart),
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.text();
    })
    .then((body) => {
      showCart(JSON.parse(body));
    });
}

function showCart(data) {
  const cartNav = document.querySelector(".cart-nav");

  if (!cartNav) return;

  const container = document.createElement("div");

  let total = 0;

  for (let key in cart) {
    const li = createCartLi(data, key);
    container.append(li);
    total += cart[key] * data[key]["cost"];
  }

  const totalEl = createTotalEl(total);
  container.append(totalEl);

  cartNav.innerHTML = container.innerHTML;

  const minusBtns = document.querySelectorAll(".cart-item__minus-btn");
  minusBtns.forEach((btn) => btn.addEventListener("click", minusCart));

  const plusBtns = document.querySelectorAll(".cart-item__plus-btn");
  plusBtns.forEach((btn) => btn.addEventListener("click", plusCart));

  console.log(total);
  console.log(data);
}

function minusCart() {
  console.log(this);
  const id = +this.dataset.goods_id;
  if (cart[id] == 1) {
    delete cart[id];
  } else {
    cart[id]--;
  }
  ajaxGetGoodsInfo();
}

function plusCart() {
  console.log(this);
  const id = +this.dataset.goods_id;
  cart[id] += 1;
  ajaxGetGoodsInfo();
}

function createTotalEl(total) {
  const totalEl = document.createElement("li");
  totalEl.classList.add("cart__total");
  totalEl.innerHTML = `Итого: ${getPrice(total)} BYN`;
  return totalEl;
}

function createCartLi(data, key) {
  const li = document.createElement("li");
  li.classList.add("cart-item");

  const a = document.createElement("a");
  a.href = `/goods?id=${key}`;
  a.innerHTML = data[key]["name"];

  const cartItemInfo = document.createElement("div");
  cartItemInfo.classList.add("cart-item__info");

  const liBtns = document.createElement("div");
  liBtns.classList.add("cart-item__btns");

  const minusBtn = document.createElement("button");
  minusBtn.classList.add("cart-item__minus-btn");
  minusBtn.innerHTML = "-";
  minusBtn.dataset.goods_id = key;

  const liValue = document.createElement("span");
  liValue.classList.add("cart-item__value");
  liValue.innerHTML = cart[key];

  const plusBtn = document.createElement("button");
  plusBtn.classList.add("cart-item__plus-btn");
  plusBtn.innerHTML = "+";
  plusBtn.dataset.goods_id = key;

  const liPrice = document.createElement("span");
  liPrice.classList.add("cart-item__price");
  liPrice.innerHTML = `${getPrice(data[key]["cost"] * cart[key])} BYN`;

  liBtns.append(minusBtn);
  liBtns.append(liValue);
  liBtns.append(plusBtn);

  cartItemInfo.append(liPrice);
  cartItemInfo.append(liBtns);

  li.append(a);
  li.append(cartItemInfo);

  return li;
}

function getPrice(price) {
  return new Intl.NumberFormat("ru-RU", {
    currency: "BYN",
  }).format(price);
}

function updateLocalStorageCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
