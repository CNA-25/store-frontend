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

//  localstorage keys: all beers as strings (HARDCODED) 
const wishlistBeers = ["WL-saunaSessionAle", "WL-midsummerWheat", "WL-midnightBlackIPA"]

// FUNCTION FOR GETTING LOCALSTORAGE AND CREATING WITH createCartItem()
function addWishlistItems(wishlistBeers) {
    wishlistBeers.forEach(beer => {
        if (localStorage.getItem(beer)) {
            storagedBeer = localStorage.getItem(beer)
            createCartItem(beer.slice(3), 100 + "€", storagedBeer)
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

// ADD ONE wlBeer TO CART


// TO DO:
// - remove invidual items
// - modal to added to wishlist, not cart
// - add to cart buttons
// - toast pop up message