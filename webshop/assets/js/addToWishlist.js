console.log("addToWishlist.js")
// API ADDRESS: https://wishlist-git-wishlist.2.rahtiapp.fi/

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

// function to make API call ADD to WISHLIST
async function addItemToWishlist(sku, jwt) {
    // LIVE URL = `http://localhost:8001/wishlist/${sku}`
    const url = `https://wishlist-git-wishlist.2.rahtiapp.fi/wishlist/${sku}`
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`, // Send token in header
            'Content-Type': 'application/json'
        }
    })
    if (!response.ok) {
        const errorData = await response.json()
        console.error('Error Data:', errorData)
        throw new Error(`Failed to add item: ${response.statusText} - ${JSON.stringify(errorData)}`)
    }
    return response.json() // Return the response data
}

// hardcoded beers sku codes
const skuCodes = ["123-ABC", "456-DEF", "789-GHI", "321-JKL", "654-MNO"]

// Add eventlisteners to ADD to WISHLIST buttons 
document.querySelectorAll(".btn-add-wishlist").forEach((button, index) => {
    button.addEventListener("click", function() {
        addItemToWishlist(skuCodes[index], window.jwtNotBearer)
        handleToast("Lager")
    })
})

// function to handle toast notification for adding to wishlist
function handleToast(beer) {
    const toastTrigger = beer
    const toastLiveExample = document.getElementById('liveToast')

    if (toastTrigger) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()
    }
}