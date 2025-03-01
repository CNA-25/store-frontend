console.log("wishlist.js")
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
const jwt = localStorage.getItem('jwt') 
const userId = getUserIdFromJWT(jwtToken)
if (!userId) {
    console.error("User ID could not be extracted from JWT")
    return
}

// Function for creating the cart list elements
function createCartItem(title, content, userId, sku) {
    // the bootstrap list
    const bsList = document.querySelector("#cart-items-container ol")
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
    `
    bsList.appendChild(listItem)
    
    // Attach event listeners to buttons immediately
    // REMOVE ONE
    listItem.querySelector('.remove-from-wl-btn').addEventListener('click', async () => {
        console.log(`Removed: ${title}`)
        // remove one from wishlist
        await removeFromWishlist(userId, sku)
        listItem.remove();
    })
    // ADD ONE
    listItem.querySelector('.wl-to-cart-btn').addEventListener('click', async () => {
        console.log(`Added to cart: ${title}`)
        await addItemToCart(userId, 1, 1) //HARDCODED PRODUCT ID (fix: sku != product_id)
        // remove from wishlist
        removeFromWishlist(userId, sku)
        listItem.remove()
    })
}

// Function to fetch wishlist items from the server
async function fetchWishlistItems(userId) { 
    const url = `https://wishlist-git-wishlist.2.rahtiapp.fi/wishlist/${userId}`
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `${jwt}`, // Send token in header
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error(`Failed to fetch wishlist items: ${response.statusText}`)
        }
        const data = await response.json()
        return data.wishlist
    } catch (error) {
        console.error('Error fetching wishlist items:', error)
        return []
    }
}

// Function to remove item from wishlist
async function removeFromWishlist(userId, sku) { 
    const url = `https://wishlist-git-wishlist.2.rahtiapp.fi/wishlist/${userId}/${sku}`
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `${jwt}`, // Send token in header
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorData = await response.json()
            console.error('Error Data:', errorData)
            throw new Error(`Failed to remove item from wishlist: ${response.statusText}`)
        }
        const data = await response.json()
        console.log(data.message)
    } catch (error) {
        console.error('Error removing item from wishlist:', error)
    }
}
// Function to add to cart with API fetch
async function addItemToCart(userId, productId, quantity = 1) {
    const url = `https://cart-service-git-cart-service.2.rahtiapp.fi/cart/?user_id=${userId}&product_id=${productId}&quantity=${quantity}`

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!response.ok) {
        const errorData = await response.json()
        console.error('Error Data:', errorData)
        throw new Error(`Failed to add item: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }
    return response.json() // Return the response data
}

// Function to add wishlist items to the list
async function addWishlistItems(userId) {
    const wishlistItems = await fetchWishlistItems(userId)
    console.log(wishlistItems)
    wishlistItems.forEach(item => {
        createCartItem(item.name, item.description, userId, item.sku)
    });
}
// Initialize the wishlist
addWishlistItems(userId)

// Clear whole wishlist button functionality
const emptyWishlistBtn = document.querySelector('#empty-wishlist-btn')
// Add event listener to clear wishlist
emptyWishlistBtn.addEventListener('click', async () => {
    const wishlistItems = await fetchWishlistItems(userId)
    for (const item of wishlistItems) {
        await removeFromWishlist(userId, item.sku)
    }
    location.reload()
})

// Add whole wishlist to cart button functionality
document.querySelector('#add-all-wishlist-btn').addEventListener('click', async () => {
    const wishlistItems = await fetchWishlistItems(userId)
    wishlistItems.forEach(item => {
        // Add to cart logic here
        console.log(`Added to cart: ${item.name}`)
        // Remove from wishlist
        removeFromWishlist(userId, item.sku)
    })
    location.reload()
})