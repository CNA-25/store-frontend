console.log("addToWishlist.js")
// API ADDRESS: https://wishlist-git-wishlist.2.rahtiapp.fi/

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

// function to handle toast notification for adding to wishlist
function handleToast(productId) {
    const toast = document.getElementById('liveToast')
    // show toast
    if (productId) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast)
        toastBootstrap.show()
    }
}