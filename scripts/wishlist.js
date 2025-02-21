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
            <div class="fw-bold beer-title">${title}</div>
            ${content}
        </div>
        <button class="btn btn-danger remove-from-wl-btn">Remove</button>
        <button class="btn btn-success wl-to-cart-btn">Add to cart</button>
        <span class="badge text-bg-primary rounded-pill">${amount}</span>
    `
    bsList.appendChild(listItem)
    
    // Attach event listeners to buttons immediately
    // REMOVE ONE
    listItem.querySelector('.remove-from-wl-btn').addEventListener('click', () => {
        console.log(`Removed: ${title}`)
        // remove one from wishlist
        if (localStorage.getItem(title)) localStorage.setItem(title, Number(localStorage.getItem(title)) - 1)
    })
    // ADD ONE
    listItem.querySelector('.wl-to-cart-btn').addEventListener('click', () => {
        console.log(`Added to cart: ${title}`)
        if (localStorage.getItem(title)) localStorage.setItem(title, Number(localStorage.getItem(title)) + 1)
        else localStorage.setItem(title, 1)
    })
}

//  localstorage keys: all beers as strings (HARDCODED) 
const wishlistBeers = ["WL-saunaSessionAle", "WL-midsummerWheat", "WL-midnightBlackIPA"]

// FUNCTION FOR GETTING LOCALSTORAGE AND CREATING WITH createCartItem()
function addWishlistItems(wishlistBeers) {
    wishlistBeers.forEach(beer => {
        if (localStorage.getItem(beer)) {
            wlBeerVal = localStorage.getItem(beer)
            createCartItem(beer.slice(3), 100 + "€", wlBeerVal)
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

// ADD ALL wlBeer TO CART
document.querySelector('#add-all-wishlist-btn').addEventListener('click', ()=> {
    // loop through all beers and get if exsist in local storage
    ["WL-saunaSessionAle", "WL-midsummerWheat", "WL-midnightBlackIPA"].forEach((wlBeer) => {
        if (localStorage.getItem(wlBeer)) {
            // remove wl- from name and add to localstorage (cart)
            cartBeer = wlBeer.slice(3)
            cartBeerVal = Number(localStorage.getItem(cartBeer))
            wlBeerVal = Number(localStorage.getItem(wlBeer))
            if (localStorage.getItem(cartBeer)) {
                // item already exsists in cart, add more
                localStorage.setItem(cartBeer, cartBeerVal + wlBeerVal)
            } else localStorage.setItem(cartBeer, wlBeerVal)
            // remove items from wishlist
            localStorage.removeItem(wlBeer)
            // show results /refresh page
            location.reload()
        }
    })     
})

// TO DO:
// - remove invidual items
// - modal to added to wishlist, not cart
// - add to cart buttons
// - toast pop up message