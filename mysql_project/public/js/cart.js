const cart = {};

document.querySelectorAll('.add-to-cart').forEach((evt) => {
    evt.addEventListener('click', addToCart);
})

function addToCart(){
    const goodsId = this.dataset.goods_id;
    if (cart[goodsId]){
        cart[goodsId]++;
    }else{
        cart[goodsId] = 1;
    }
    console.log(cart);

    ajaxGetGoodsInfo();
}

function ajaxGetGoodsInfo(){
    fetch('/get-goods-info', {
        method: 'POST',
        body: JSON.stringify({
            key: Object.keys(cart)
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
    .then((response) => {
        console.log(response.text())
    })
    .then((body) => {
        console.log(body);
    })
}