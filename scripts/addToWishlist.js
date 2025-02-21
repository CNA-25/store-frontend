console.log("addToWishlist.js")

// Add eventlisteners to ADD to WISHLIST buttons
document.querySelectorAll(".btn-add-wishlist").forEach(button => {
    button.addEventListener("click", function() {
        const beerDiv = this.closest(".beer-container").querySelector(".flexed-beers")
        const wlBeer = "WL-" + beerDiv.id
        if (localStorage.getItem(wlBeer)){
            // handle localstorage
            localStorage.setItem(wlBeer, Number(localStorage.getItem(wlBeer)) + 1) 
            //handle toast to notify user of adding to cart
            handleToast(beerDiv)
        }
        else {
            localStorage.setItem(wlBeer, 1) 
            //handle toast to notify user of adding to cart
            handleToast(beerDiv)
        }
    })
})

// FUNCTION FOR HANDLE TOAST NOTIFICATION FOR ADDING TO CART
function handleToast(beer) {
    const toastTrigger = beer
    const toastLiveExample = document.getElementById('liveToast')

    if (toastTrigger) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()
    }
}