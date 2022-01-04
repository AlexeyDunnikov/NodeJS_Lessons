const nav = document.querySelector(".site-nav");

document
  .querySelector(".site-nav__close-btn")
  .addEventListener("click", closeNav);

document
  .querySelector(".site-nav__open-btn")
  .addEventListener("click", openNav);

getCategoryList();

function getCategoryList() {
  fetch("/get-category-list", {
    method: "POST",
  })
    .then((res) => res.text())
    .then((body) => {
      console.log(body);
      showCategoryList(JSON.parse(body));
    });
}

function showCategoryList(data) {
  const list = document.querySelector(".site-nav__category-list");

  data.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("category-list__item");

    const a = document.createElement("a");
    a.classList.add("category-list__item-link");
    a.href = `/cat?id=${item.id}`;
    a.textContent = item.category;

    li.append(a);
    list.append(li);
  });
}

function closeNav() {
  nav.classList.remove("active");
}

function openNav() {
  nav.classList.add("active");
}
