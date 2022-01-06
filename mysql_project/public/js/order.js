document.querySelector(".alex-shop-order").addEventListener('submit', (evt) => {
    evt.preventDefault();
    const username = document.querySelector('#username').value.trim();
    const phone = document.querySelector("#phone").value.trim();
    const email = document.querySelector("#email").value.trim();
    const address = document.querySelector("#address").value.trim();

    if (!document.querySelector('#rule').checked){

    }

    if (username === "" || phone === "" || email === "" || address === ""){

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
    .then((response) => {
        if (response.status === 200){
            return response.text();
        }
        else{
            throw new Error('Error')
        }
    })
    .then((body) => {
        if (body === '1'){

        }
        else{

        }
    });
});