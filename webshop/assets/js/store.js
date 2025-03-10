async function showProducts() {
    const URL = 'https://product-service-cna-product-service.2.rahtiapp.fi';
    try {
        await fetch(URL);
    } catch (error) {
        console.log('Failed to fetch api', error);
        document.querySelector('#output').innerHTML = "<p>Failed to fetch API</p>";
        return;
    }
    const resp = await fetch(`${URL}/products`);
    const data = await resp.json();
    console.log(data.msg);

    // Visa produkter
    var outputString = ``;

    for (product of data.products) {
        outputString += `
            <div id="${product.sku}">
                <p>----------</p>
                <p>${product.name}</p>
                <img src="${URL}${product.image}" alt="Product Image" width="100" height="200">
                <p>${product.price}€</p>
                <p>Info:</p>
                <p>${product.description}</p>
                <p>${product.category}, ${product.country}</p>
                <button onclick="addItemToCart(${product.id})">Add to Cart</button>
                <button onclick="addItemToWishlist(${product.sku})">Add to Wishlist</button>
            <div>
        `;
    }
    document.querySelector('#products').innerHTML = outputString;
}
showProducts();