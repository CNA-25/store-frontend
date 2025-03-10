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
                <button class="btn btn-success" onclick="addItemToCart('${userId}', '${product.id}', '${jwt}')">Add to Cart</button>
                <button class="btn btn-secondary" onclick="addItemToWishlist('${product.sku}', '${jwt}')">Add to Wishlist</button>
            <div>
        `;

    }
    document.querySelector('#products').innerHTML = outputString;
}
showProducts(window.userId, window.jwt);