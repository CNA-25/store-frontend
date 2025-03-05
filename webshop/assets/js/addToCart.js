console.log("addToCart.js")
// API ADDRESS: https://cart-service-git-cart-service.2.rahtiapp.fi/

// Function to decode JWT and extract the user ID
function getUserIdFromJWT(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1])) // Decode payload
        return payload.sub || payload.user_id // Adjust based on API structure
    } catch (e) {
        console.error("Invalid JWT", e)
        return null
    }
}

// Store jwt and userId globally if not already set
if (!window.jwt) {
    window.jwt = localStorage.getItem('jwt')
}
if (!window.userId) {
    window.userId = getUserIdFromJWT(window.jwt)
}
if (!window.userId) {
    console.error("User ID could not be extracted from JWT")
}
// Remove the 'Bearer ' part (space included)
window.jwtNotBearer = window.jwt.replace('Bearer ', '')

// Function to add to cart with API fetch
async function addItemToCart(userId, productId, jwt, quantity = 1) {
    // LOCAL URL = `http://localhost:8000/cart/?user_id=${userId}&product_id=${productId}&quantity=${quantity}`
    const url = `https://cart-service-git-cart-service.2.rahtiapp.fi/cart/?user_id=${userId}&product_id=${productId}&quantity=${quantity}`

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'token': `${jwt}`, // Send token in header
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to add item: ${response.statusText} - ${JSON.stringify(errorData)}`)
    }

    return response.json() // Return the response data
}

// Function to UI buttons to add beer to cart
function addBeerBtn(beerIds, beers) {
    beers.forEach((beer, index)=> {
        beer.addEventListener('click', () => {
            // use function for making api call to add to cart
            addItemToCart(window.userId, beerIds[index], window.jwtNotBearer)
                //for dev purposes
                //.then(data => console.log('Item added:', data))
                //.catch(error => console.error('Error:', error))
            //toast to notify of action
            handleToast(beer)
        })
    })    
}
// HARDCODED BEERS
const saunaSessionAle = document.querySelector('#saunaSessionAle')
const midsummerWheat = document.querySelector('#midsummerWheat')
const midnightBlackIPA = document.querySelector('#midnightBlackIPA')
beers = [saunaSessionAle, midsummerWheat, midnightBlackIPA]

beerIds = [1, 2, 3] // hardcoded beerid
addBeerBtn(beerIds, beers)

// FUNCTION FOR HANDLE TOAST NOTIFICATION FOR ADDING TO CART
function handleToast(beer) {
    const toastTrigger = beer
    const toastLiveExample = document.getElementById('liveToast')

    if (toastTrigger) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()
    }
}
