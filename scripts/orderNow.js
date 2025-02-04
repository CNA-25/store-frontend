console.log("orderNow.js")

// go to shopping cart from modals primary button
const modalCartBtn = document.querySelector('#modal-cart-btn')
modalCartBtn.addEventListener('click', ()=> {
    window.location.href = window.location.origin + "/routes/shoppingCart.html";
})

// add 100 beers to cart button
btnContainer = document.querySelector('#big-buy-btn-container')
buyBtn = btnContainer.querySelector('button')
buyBtn.addEventListener('click', ()=> {
    localStorage.setItem('saunaSessionAle', 100)
})
