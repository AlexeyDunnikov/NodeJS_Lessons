function toCurrency(price){
  return new Intl.NumberFormat("ru-RU", {
    currency: "BYN",
    style: "currency",
  }).format(price);
};

// let block1 = document.querySelector(".block-1");

// //let block1Style = block1.style;
// block1.style.width = "200px";
// console.log(block1.style);

// block1.classList.add("red");
// block1.classList.add("green");

// block1.classList.remove("green");

// console.log(block1.classList); // список всех классов
// // проверка наличия класса у элемента
// console.log(block1.classList.contains("red"));

// block1.classList.toggle("red");

const pricesEl = document.querySelectorAll(".price");
pricesEl.forEach((node) => {
    node.textContent = toCurrency(node.textContent);
});
