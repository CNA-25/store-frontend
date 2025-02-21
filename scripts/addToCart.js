console.log("addToCart.js")

// BROWSE BEERS

// front page beers as add to shopping cart/buy buttons
saunaSessionAle = document.querySelector('#saunaSessionAle')
midsummerWheat = document.querySelector('#midsummerWheat')
midnightBlackIPA = document.querySelector('#midnightBlackIPA')

// list of beers so that we can add easily more beers as nessecary
const beers = [saunaSessionAle, midsummerWheat, midnightBlackIPA]

// add beer to cart ( LOCAL STORAGE )
// function for adding eventlisteners to beers
function beerButtons(beerName) {
    beerName.addEventListener('click', ()=> {
        // add a beer to the localstorage, else create the localstorage
        if (localStorage.getItem(beerName.id)){
            // handle localstorage
            localStorage.setItem(beerName.id, Number(localStorage.getItem(beerName.id)) + 1) 
            //handle toast to notify user of adding to cart
            handleToast(beerName)
        }
        else {
            localStorage.setItem(beerName.id, 1) 
            //handle toast to notify user of adding to cart
            handleToast(beerName)
        }
    })    
}
// loop through beers and use function on them 
beers.forEach(beerButtons)

// FUNCTION FOR HANDLE TOAST NOTIFICATION FOR ADDING TO CART
function handleToast(beer) {
    const toastTrigger = beer
    const toastLiveExample = document.getElementById('liveToast')

    if (toastTrigger) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()
    }
}