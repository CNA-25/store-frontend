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
        const safeProductName = product.name.replace(/'/g, "\'"); // Escape apostrophes

        // Disable knappen if out of stock
        var buttonString = `<button class="btn btn-success" onclick="addItemToCart('${userId}', '${product.sku}', '${jwt}'); handleToast('${safeProductName}', 'cart')">Add to Cart</button>`
        var stock = getStock(product.sku);
        if (stock < 1) {
            buttonString = `<button class="btn btn-secondary" disabled>Out of Stock</button>`
        }

        outputString += `
            <div class="product-card">
                <div id="${product.sku}">
                    <h2>${safeProductName}</h2>
                    <p>${product.price}€</p>
                    <p>Info:</p>
                    <p class="product-card-text">${product.description}</p>
                    <p>${product.category}, ${product.country}</p>
                    ${buttonString}
                    <button class="btn btn-secondary" onclick="addItemToWishlist('${product.sku}', '${jwt}'); handleToast('${safeProductName}', 'wishlist')">Add to Wishlist</button>
                </div>
                <img class="product-image" src="https://product-service-cna-product-service.2.rahtiapp.fi${product.image}" alt="Product Image">
            </div>
        `;
    }
    document.querySelector('#products').innerHTML = outputString;
}
showProducts(window.userId, window.jwt);

// Check inventory
async function getStock(sku) {
    const url = ` https://inventory-service-inventory-service.2.rahtiapp.fi/inventory/?productCodes=${sku}`;
    try {
        const resp = await fetch(url);
        const data = await resp.json();
        return data[0].stock;
    } catch (error) {
        console.error(error)
        return 0;
    }
}

// function to handle toast notification for adding to wishlist
function handleToast(productName, type) {
    const toast = document.getElementById('liveToast')
    if (toast && productName) {
         
        const toastBody = toast.querySelector('.toast-body')
        const toastHeader = toast.querySelector('.me-auto')
        // toast content
        if (toastBody) {
            toastBody.textContent = `${productName} added to ${type}.`
        }
        // toast header
        if (toastHeader) {
            toastHeader.textContent = type === 'cart' ? 'Shopping Cart' : 'Wishlist';
        }
        
        // Get or create the toast instance and show it
        const toastBootstrap = new bootstrap.Toast(toast)
        toastBootstrap.show()
    } else {
        console.error('Toast element not found or product title is empty')
    }
}
