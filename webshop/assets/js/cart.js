console.log("cart.js");
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
const jwt = localStorage.getItem('jwt')
const userId = getUserIdFromJWT(jwt)
if (!userId) {
    console.error("User ID could not be extracted from JWT")
}

// Function to create a cart item UI element
function createCartItemUI(title, content, amount) {
    const bsList = document.querySelector("#cart-items-container ol")
    const listItem = document.createElement("li")
    listItem.className = "list-group-item d-flex justify-content-between align-items-start"
    listItem.innerHTML = `
        <div class="ms-2 me-auto">
            <div class="fw-bold">${title}</div>
            ${content}
        </div>
        <button class="btn btn-danger">Remove</button>
        <span class="badge text-bg-primary rounded-pill">${amount}</span>
    `
    bsList.appendChild(listItem)

    // enable buttons
    document.querySelector('#empty-cart-btn').disabled = false
    document.querySelector('#checkout-btn').disabled = false
}

// Function to fetch cart items from the server
async function fetchCartItems(userId) {
    const url = `https://cart-service-git-cart-service.2.rahtiapp.fi/cart/${userId}`
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Authorization": `${jwt}`, // Send token in header
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error(`Failed to fetch cart items: ${response.statusText}`)
        }
        const data = await response.json()
        return data.cart
    } catch (error) {
        console.error('Error fetching cart items:', error)
        return []
    }
}

// Function to add cart items to the list
async function addCartItems(userId) {
    try {
        const cartItems = await fetchCartItems(userId)
        cartItems.forEach(item => {
            createCartItemUI(item.product_name, `${item.price}€`, item.quantity)
        })
        return cartItems
    } catch (error) {
        return undefined
    }
}

// function to make request to clear cart
async function clearCart(userId) {
    const url = `https://cart-service-git-cart-service.2.rahtiapp.fi/cart/${userId}`
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                "Authorization": `${jwt}`, // Send token in header
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error(`Failed to clear cart: ${response.statusText}`)
        }
        return response.json()
    } catch (error) {
        console.error('Error clearing cart:', error)
    }
}
function clearCartUI() {
    // get the cart list element
    const bsList = document.querySelector("#cart-items-container ol")
    // create image element and append to the list
    bsList.innerHTML = ""; // Clear the list
    const img = document.createElement("img")
    img.src = "/webshop/assets/images/empty_beer_beach_small.jpg"
    img.alt = "Empty Cart"; // Optional: Add alt text
    img.style.width = "100%"; // Adjust size if needed
    bsList.appendChild(img);
    //change title to empty cart
    const title = document.querySelector(".title-container h1")
    title.innerHTML = "Empty Cart"
    //disable buttons
    document.querySelector('#empty-cart-btn').disabled = true
    document.querySelector('#checkout-btn').disabled = true
}
// add event listener to the empty cart button
document.querySelector('#empty-cart-btn').addEventListener('click', () => {
    clearCart(userId)
    clearCartUI()
})

// Initialize the cart
async function initializeCart() {
    const cartItems = await addCartItems(userId)
    if (cartItems == undefined) {
        console.log("Cart is empty")
        clearCartUI()
    } else {
        console.log("Cart has items")
    }
}

// Run the initialization function when the script loads
initializeCart()