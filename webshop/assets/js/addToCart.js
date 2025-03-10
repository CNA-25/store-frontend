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
    })

    if (!response.ok) {
        const errorData = await response.json()
        //console.error(errorData)
        // USE PATCH METHOD TO UPDATE QUANTITY IF ITEM ALREADY IN CART
        if (errorData.detail === "Item already in cart. To update quantity use appropriate endpoint.") {
            console.warn("Item already in cart, updating quantity...")

            // LOCAL URL = `http://localhost:8000/cart/${userId}/${productId}`
            const updateItemUrl = `https://cart-service-git-cart-service.2.rahtiapp.fi/cart/${userId}/${productId}/{quantity}?quantity_change=${quantity}`
            
            // Now call the update endpoint
            let updateResponse = await fetch(updateItemUrl, {
                method: "PATCH", // Change to correct method if needed
                headers: {
                        "Content-Type": "application/json", 
                        "token": `${jwt}`
                }
            })
            if (updateResponse.ok) {
                console.log("Item quantity updated.")
            }

            if (!updateResponse.ok) {
                throw new Error("Failed to update item quantity.")
            }
        }
    }
}

