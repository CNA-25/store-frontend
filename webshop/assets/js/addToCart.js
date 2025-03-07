console.log("addToCart.js")
// API ADDRESS: https://cart-service-git-cart-service.2.rahtiapp.fi/

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

