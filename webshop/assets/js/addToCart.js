console.log("addToCart.js")
// API ADDRESS: https://cart-service-git-cart-service.2.rahtiapp.fi/

//HARDCODED USERID
const userId = 1 // Replace with actual user ID
const jwt = localStorage.getItem('jwt') 

// Function to add to cart with API fetch
async function addItemToCart(productId, quantity = 1) {
    const url = `https://cart-service-git-cart-service.2.rahtiapp.fi/cart/?product_id=${productId}&quantity=${quantity}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `${jwt}`, // Send token in header
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json()
        console.error('Error Data:', errorData)
        throw new Error(`Failed to add item: ${response.statusText} - ${JSON.stringify(errorData)}`)
    }

    return response.json() // Return the response data
}

// Function to UI buttons to add beer to cart
function addBeerBtn(beerIds, beers) {
    beers.forEach((beer, index)=> {
        beer.addEventListener('click', () => {
            // use function for making api call to add to cart
            addItemToCart(1, beerIds[index], 1)
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

// Function to get all available beers
async function getAllBeers() {
    try {
        const response = await fetch("https://cart-service-git-cart-service.2.rahtiapp.fi/beers/", {
            method: "GET",
            headers: {
                "Authorization": `${jwt}`, // Send token in header
                "Content-Type": "application/json"
            }
        })
        const data = await response.json()
        console.log(data)
    } catch (error) {
        console.error("Failed to fetch beers:", error)
    }
}
getAllBeers()
