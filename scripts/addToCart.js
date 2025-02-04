console.log("addToCart.js")

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
        console.log("click on " + beerName.id)
        // add a beer to the localstorage, else create the localstorage
        if (localStorage.getItem(beerName.id)){
            localStorage.setItem(beerName.id, Number(localStorage.getItem(beerName.id)) + 1) 
        }
        else localStorage.setItem(beerName.id, 1) 
    })    
}
// loop through beers and use function on them 
beers.forEach(beerButtons)