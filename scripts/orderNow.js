console.log("orderNow.js")

// go to shopping cart from modals primary button
const modalCartBtn = document.querySelector('#modal-cart-btn')
modalCartBtn.addEventListener('click', ()=> {
    window.location.href = window.location.origin + "/routes/shoppingCart.html";
})
