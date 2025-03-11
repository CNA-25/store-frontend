console.log("wishlist.js")
// API ADDRESS: https://wishlist-git-wishlist.2.rahtiapp.fi/

// Function for creating the cart list elements
function createCartItem(userId, sku, jwt) {
    // the bootstrap list
    const bsList = document.querySelector("#cart-items-container ol")
    // create list element
    const listItem = document.createElement("li")
    listItem.className = "list-group-item d-flex justify-content-between align-items-start"
    // list item content 
    listItem.innerHTML = `
        <div class="ms-2 me-auto">
            <div class="fw-bold beer-title">${sku}</div>
            ${sku}
        </div>
        <button class="btn btn-danger remove-from-wl-btn">Remove</button>
        <button class="btn btn-success wl-to-cart-btn">Add to cart</button>
    `
    bsList.appendChild(listItem)
    
    // Attach event listeners to buttons immediately
    // REMOVE ONE
    listItem.querySelector('.remove-from-wl-btn').addEventListener('click', async () => {
        console.log(`Removed: ${sku}`)
        // remove one from wishlist
        await removeFromWishlist(sku, jwt)
        listItem.remove()
    })
    // ADD ONE
    listItem.querySelector('.wl-to-cart-btn').addEventListener('click', async () => {
        console.log(`Added to cart: ${sku}`)
        await addItemToCart(userId, sku, jwt) 
        .then(data => console.log('Item added:', data))
        .catch(error => console.error('Error:', error))
        // remove from wishlist
        removeFromWishlist(sku, jwt)
        listItem.remove()
    })
}

// Function to fetch wishlist items from the server
async function fetchWishlistItems(userId, jwt) { 
    // LOCAL API URL = `http://localhost:8000/wishlist/${userId}`
    const url = `https://wishlist-git-wishlist.2.rahtiapp.fi/wishlist/${userId}`
    console.log(`Fetching wishlist items from URL: ${url}`)
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`, // Send token in header
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error(`Failed to fetch wishlist items: ${response.statusText}`)
        }
        const data = await response.json()
        console.log('Fetched wishlist items:', data)
        return data.wishlist
    } catch (error) {
        console.error('Error fetching wishlist items:', error)
        return 
    }
}

// Function to add wishlist items to the list
async function addWishlistItems(userId, jwt) {
    const wishlistItems = await fetchWishlistItems(userId, jwt)
    //console.log(wishlistItems)
    wishlistItems.forEach(item => {
        createCartItem(userId, item.sku, jwt)
    })
}
// Initialize the wishlist
addWishlistItems(window.userId, window.jwt)

// Function to remove item from wishlist
async function removeFromWishlist(sku, jwt) { 
    // LOCAL API URL = `http://localhost:8000/wishlist/${sku}`
    const url = `https://wishlist-git-wishlist.2.rahtiapp.fi/wishlist/${sku}`
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${jwt}`, // Send token in header
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            const errorData = await response.json()
            console.error('Error Data:', errorData)
            throw new Error(`Failed to remove item from wishlist: ${response.statusText}`)
        }
        const data = await response.json()
        console.log(data.message)
    } catch (error) {
        console.error(error)
    }
}

// Clear whole wishlist button functionality
const emptyWishlistBtn = document.querySelector('#empty-wishlist-btn')
// Add event listener to clear wishlist
emptyWishlistBtn.addEventListener('click', async () => {
    const wishlistItems = await fetchWishlistItems(window.userId, window.jwt)
    for (const item of wishlistItems) {
        await removeFromWishlist(item.sku, window.jwt)
    }
    location.reload()
})

// AddEventListener "add all to cart" button 
document.querySelector('#add-all-wishlist-btn').addEventListener('click', async () => {
    const wishlistItems = await fetchWishlistItems(window.userId, window.jwt)
    wishlistItems.forEach(item => {
        // Add to cart logic here
        console.log(`Added to cart: ${item.sku}`)
        // Remove from wishlist
        removeFromWishlist(item.sku, window.jwt)
    })
    location.reload()
})