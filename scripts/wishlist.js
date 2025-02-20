console.log("wishlist.js")

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
        <button class="btn btn-success">Add to cart</button>
        <span class="badge text-bg-primary rounded-pill">${amount}</span>
    `

    bsList.appendChild(listItem)
}

// ADD ALL ITEMS FROM LOCAL STORAGE TO LIST

//  localstorage keys: all beers as strings (HARDCODED) 
const wishlistBeers = ["WL-saunaSessionAle", "WL-midsummerWheat", "WL-midnightBlackIPA"]

// function getting the cart items from the local storage and createCartItem with them
function addWishlistItems(wishlistBeers) {
    wishlistBeers.forEach(beer => {
        if (localStorage.getItem(beer)) {
            storagedBeer = localStorage.getItem(beer)
            createCartItem(beer, 100 + "€", storagedBeer)
            console.log(storagedBeer)
        }
    })    
}
addWishlistItems(wishlistBeers)

// CLEAR/EMPTY CART BUTTON
emtpyCartBtn = document.querySelector('#empty-wishlist-btn')
//add eventlistener to clear localstorage
emtpyCartBtn.addEventListener('click', ()=> {
    ["WL-saunaSessionAle", "WL-midsummerWheat", "WL-midnightBlackIPA"].forEach(item => localStorage.removeItem(item))
    location.reload()
})