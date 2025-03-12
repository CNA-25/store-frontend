console.log("cart.js");
// API ADDRESS: https://cart-service-git-cart-service.2.rahtiapp.fi/

// Function to fetch all product data
async function fetchProductData() {
    const URL = 'https://product-service-cna-product-service.2.rahtiapp.fi/products'
    try {
        const resp = await fetch(URL)
        const data = await resp.json()
        //console.log(data.msg)
        return data.products
    } catch (error) {
        console.log('Failed to fetch product data', error)
        return []
    }
}

let cachedProducts = null

// Function to create a cart item UI element
async function createCartItemUI(userId, productId, quantity, jwt) {
    // fetch items if not in cache
    if (!cachedProducts) {
        cachedProducts = await fetchProductData();
    }
    
    // Find the product details by ID
    const productDetails = cachedProducts.find(product => product.sku == productId)
    if (!productDetails) {
        console.error(`Product with ID ${productId} not found.`)
        return
    }

    const bsList = document.querySelector("#cart-items-container ol")
    const listItem = document.createElement("li")
    listItem.className = "list-group-item d-flex justify-content-between align-items-start"
    // create HTML content 
    listItem.innerHTML = `
        <div class="ms-2 me-auto">
            <div class="fw-bold">${productDetails.name}</div>
            ${productDetails.description}
        </div>
        <button class="btn btn-danger remove-item-cart-btn">Remove</button>
        <span class="badge text-bg-primary rounded-pill">${quantity}</span>
    `
    bsList.appendChild(listItem)

    // Attach event listener to the remove button
    listItem.querySelector('.remove-item-cart-btn').addEventListener('click', async () => {
        console.log(`Removed product_id: ${productId}`)
        await removeItemFromCart(userId, productId, jwt)
        listItem.remove()
    })

    // enable buttons
    document.querySelector('#empty-cart-btn').disabled = false
    document.querySelector('#checkout-btn').disabled = false
}

// Function to fetch cart items from the server
async function fetchCartItems(userId, jwt) {
    // LOCAL URL = `http://localhost:8000/cart/${userId}`
    const url = `https://cart-service-git-cart-service.2.rahtiapp.fi/cart/${userId}`
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'token': `${jwt}`, // Send token in header
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`Failed to fetch cart items: ${response.statusText} - ${JSON.stringify(errorData)}`)
        }
        const data = await response.json()
        return data.cart
    } catch (error) {
        console.error(error)
        return
    }
}

// Function to add cart items to the list
async function addCartItems(userId, jwt) {
    try {
        const cartItems = await fetchCartItems(userId, jwt)
        //console.log(cartItems)
        cartItems.forEach(item => {
            createCartItemUI(userId, item.product_id, item.quantity, jwt)
        })
        return cartItems
    } catch (error) {
        return undefined
    }
}

// function to make request to clear cart
async function clearCart(userId , jwt) {
    // LOCAL URL = `http://localhost:8000/cart/${userId}`
    const url = `https://cart-service-git-cart-service.2.rahtiapp.fi/cart/${userId}`
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'token': `${jwt}`, // Send token in header
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

// function to remove one item from cart
async function removeItemFromCart(userId, productId, jwt) {
    // LOCAL URL = `http://localhost:8000/cart/${userId}/${sku}`
    const url = `https://cart-service-git-cart-service.2.rahtiapp.fi/cart/${userId}/${productId}`
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'token': `${jwt}`, // Send token in header
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error(`Failed to remove item from cart: ${response.statusText}`)
        }
        return response.json()
    } catch (error) {
        console.error('Error removing item from cart:', error)
    }
}

// function to clear cart UI
function clearCartUI() {
    // get the cart list element
    const bsList = document.querySelector("#cart-items-container ol")
    // create image element and append to the list
    bsList.innerHTML = ""; 
    const img = document.createElement("img")
    img.src = "/webshop/assets/images/empty_beer.jpg"
    img.alt = "Empty Cart"; 
    img.style.width = "60%";  
    document.querySelector("#cart-container").appendChild(img);
    //change title to empty cart
    const title = document.querySelector(".flex-container h1")
    title.innerHTML = "Empty Cart"
    //disable buttons
    document.querySelector('#empty-cart-btn').disabled = true
    document.querySelector('#checkout-btn').disabled = true
}
// add event listener to the empty cart button
document.querySelector('#empty-cart-btn').addEventListener('click', () => {
    clearCart(window.userId, window.jwt)
    clearCartUI()
})

// Initialize the cart
async function initializeCart(userId, jwt) {
    const cartItems = await addCartItems(userId, jwt)
    if (cartItems == undefined) {
        console.log("Cart is empty")
        clearCartUI()
    } else {
        console.log("Cart has items")
    }
}

// Run the initialization function when the script loads
initializeCart(window.userId, window.jwt)

// last chance product cards
fetchProductData().then(products => {
    // Select 3 random products
    const lastChanceProducts = products
    .sort(() => Math.random() - 0.5) // Shuffle the array
    .slice(0, 3); // Select the first 3 items
    // random sales pitch
    const beerSalesPitches = [
        "Your fridge isn't full—it's just understocked! 🍻",
        "Beer doesn't take up space, it creates memories! 🎉",
        "A six-pack today saves a sad fridge tomorrow! 🏆",
        "Last chance? More like best chance—to grab more beer! 🚀",
        "Running out of beer is a choice. Don't make that mistake! 🤦‍♂️",
        "Your future self will thank you for this extra round! 🔄",
        "There's always space for one more... or three! 🍺🍺🍺"
    ]
    const randomPitch = beerSalesPitches[Math.floor(Math.random() * beerSalesPitches.length)];
    document.querySelector("#last-chance-title").textContent = randomPitch

    // Create a card for each product    
    lastChanceProducts.forEach(async product => {
        const productCard = await createLastChanceProductCard(product)
        document.querySelector("#last-chance-products").appendChild(productCard)
    })
})
async function createLastChanceProductCard(product) {
    const productCard = document.createElement("div")
    productCard.className = "product-card"
    document.querySelector("#last-chance-products").innerHTML = ""
    productCard.innerHTML = `
        <div id="${product.sku}">
            <h2>${product.name}</h2>
            <p>${product.price}€</p>
            <p>Info:</p>
            <p class="product-card-text">${product.description}</p>
            <p>${product.category}, ${product.country}</p>
            <button class="btn btn-success" onclick="addItemToCart('${window.userId}', '${product.sku}', '${window.jwt}')">Add to Cart</button>
        </div>
        <img class="product-image" src="https://product-service-cna-product-service.2.rahtiapp.fi${product.image}" alt="Product Image">
    `
    return productCard
}
