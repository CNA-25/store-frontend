console.log("shoppingCart.js")

// FUNCTION FOR CREATING THE CART LIST ELEMENTS
function createCartItem(title, content, amount) {
    // the bootstrap list
    bsList = document.querySelector("#cart-items-container ol")
    // create list element
    const listItem = document.createElement("li")
    listItem.className = "list-group-item d-flex justify-content-between align-items-start"
    // list item content 
    listItem.innerHTML = `
        <div class="ms-2 me-auto">
            <div class="fw-bold">${title}</div>
            ${content}
        </div>
        <button class="btn btn-danger">Remove</button>
        <span class="badge text-bg-primary rounded-pill">${amount}</span>
    `

    bsList.appendChild(listItem)
}

// ADD ALL ITEMS FROM LOCAL STORAGE TO LIST

//  localstorage keys: all beers as strings (HARDCODED) 
const beers = ["saunaSessionAle", "midsummerWheat", "midnightBlackIPA"]

// function getting the cart items from the local storage and createCartItem with them
function addCartItems(beers) {
    beers.forEach(beer => {
        if (localStorage.getItem(beer)) {
            storagedBeer = localStorage.getItem(beer)
            createCartItem(beer, 100 + "€", storagedBeer)
        }
    })    
}
addCartItems(beers)

// CLEAR/EMPTY CART BUTTON
emtpyCartBtn = document.querySelector('#empty-cart-btn')
//add eventlistener to clear localstorage
emtpyCartBtn.addEventListener('click', ()=> {
    localStorage.clear()
    location.reload()
})