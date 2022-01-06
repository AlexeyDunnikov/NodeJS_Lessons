document.querySelector(".alex-shop-order").addEventListener("submit", (evt) => {
  evt.preventDefault();
  const username = document.querySelector("#username").value.trim();
  const phone = document.querySelector("#phone").value.trim();
  const email = document.querySelector("#email").value.trim();
  const address = document.querySelector("#address").value.trim();

  if (username === "" || phone === "" || email === "" || address === "") {
    Swal.fire({
      title: "Внимание",
      text: "Заполните все поля",
      type: "info",
      confirmButtonText: "Ok",
    });
    return;
  }

  if (!document.querySelector("#rule").checked) {
    Swal.fire({
      title: "Внимание",
      text: "Прочитайте условия пользования",
      type: "info",
      confirmButtonText: "Ok",
    });
    return;
  }

  fetch("/finish-order", {
    method: "POST",
    body: JSON.stringify({
      username,
      phone,
      email,
      address,
      key: JSON.parse(localStorage.getItem("cart")),
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((body) => {
      if (body === "1") {
          Swal.fire({
            title: "Успешно",
            text: "Заказ отправлен на почту",
            type: "info",
            confirmButtonText: "Ok",
          });
      } else {
        Swal.fire({
          title: "Ошибка",
          text: "Проблемы с отправкой email",
          type: "error",
          confirmButtonText: "Ok",
        });
      }
    });
});
