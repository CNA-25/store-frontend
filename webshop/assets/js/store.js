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

// ADD TO CART FUNCITON
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
        throw new Error(`Failed to add item: ${response.statusText} - ${JSON.stringify(errorData)}`)
    }

    return response.json() // Return the response data
}
// ADD TO WISHLIST FUNCTION
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


async function showProducts(userId, jwt) {
    const URL = 'https://product-service-cna-product-service.2.rahtiapp.fi/products';
    try {
        await fetch(URL);
    } catch (error) {
        console.log('Failed to fetch api', error);
        document.querySelector('#output').innerHTML = "<p>Failed to fetch API</p>";
        return;
    }
    const resp = await fetch(URL);
    const data = await resp.json();
    console.log(data.msg);

    // Visa produkter
    var outputString = ``;

    for (product of data.products) {
        outputString += `
            <div id="${product.sku}">
                <p>----------</p>
                <p>${product.name}</p>
                <img src="${product.image}" alt="Product Image" >
                <p>${product.price}€</p>
                <p>Info:</p>
                <p>${product.description}</p>
                <p>${product.category}, ${product.country}</p>
                <button onclick="addItemToCart('${userId}', '${product.id}', '${jwt}')">Add to Cart</button>
                <button onclick="addItemToWishlist('${product.sku}', '${jwt}')">Add to Wishlist</button>
            <div>
        `;

    }
    document.querySelector('#products').innerHTML = outputString;
}
showProducts(window.userId, window.jwtNotBearer);