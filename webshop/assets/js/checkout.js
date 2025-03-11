// Redirect user if no JWT is found
document.addEventListener("DOMContentLoaded", () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
        window.location.href = "../login.html"; // Redirect to login page
    }
});

// Function to extract user info from JWT
function getUserInfoFromJWT(token) {
    if (!token) return { email: "", name: "", sub: "" }; // Default object if no token
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return {
            email: payload.email || "",
            name: payload.name || "",
            sub: payload.sub || ""
        };
    } catch {
        console.error("Invalid JWT");
        return { email: "", name: "", sub: "" };
    }
}

const jwt = localStorage.getItem("jwt") || "";
const { sub } = getUserInfoFromJWT(jwt);

// Function to fetch all product data
async function fetchProductData() {
    const URL = 'https://product-service-cna-product-service.2.rahtiapp.fi/products';
    try {
        const resp = await fetch(URL);
        const data = await resp.json();
        console.log(data);
        return data.products || [];
    } catch (error) {
        console.error('Failed to fetch product data', error);
        return [];
    }
}

// Function to fetch cart items
async function fetchCartItems(sub, jwt) {
    const url = `https://cart-service-git-cart-service.2.rahtiapp.fi/cart/${sub}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'token': jwt, 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error(`Failed to fetch cart items: ${response.statusText}`);

        const data = await response.json();
        return data.cart || [];
    } catch (error) {
        console.error("Error fetching cart items:", error);
        return [];
    }
}

// Function to check if the cart is empty
async function isCartEmpty(sub, jwt) {
    const cartItems = await fetchCartItems(sub, jwt);
    return cartItems.length === 0;
}

// Function to display the cart items and calculate the total price
async function displayCartItems(sub, jwt) {
    const cartItems = await fetchCartItems(sub, jwt);
    const products = await fetchProductData();

    const cartContainer = document.querySelector("#cart-items-container ol");
    const sumElement = document.querySelector("#sum");  // Get the #sum element
    if (!cartContainer || !sumElement) {
        console.error("Cart container or sum element not found.");
        return;
    }

    cartContainer.innerHTML = ""; // Clear existing cart content
    let totalPrice = 0; // Initialize total price

    if (cartItems.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        sumElement.innerHTML = "Total: $0.00"; // Display $0.00 if the cart is empty
        return;
    }

    cartItems.forEach(item => {
        // Find the product using the SKU and product_id
        const product = products.find(p => p.sku === item.sku);
        if (!product) {
            console.error(`Product with SKU ${item.product_id} not found.`);
            return;
        }

        // Calculate the total price (product price * quantity)
        const itemTotal = product.price * item.quantity;
        totalPrice += itemTotal; // Add item total to running total

        // Create list item for the cart
        const listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex justify-content-between align-items-start";
        listItem.innerHTML = `
            <div class="ms-2 me-auto">
                <div class="fw-bold">${product.name}</div>
                ${product.description}
            </div>
            <span class="badge text-bg-primary rounded-pill">${item.quantity}</span>
            <span class="fw-bold">$${product.price}</span>
        `;
        cartContainer.appendChild(listItem);
    });

    // Update the total price
    sumElement.innerHTML = `Total: $${totalPrice.toFixed(2)}`; // Format to two decimal places
}

// Initialize cart display when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    displayCartItems(sub, jwt);
});

// Display user info in checkout form
document.addEventListener("DOMContentLoaded", () => {
    const userInfo = getUserInfoFromJWT(jwt);
    if (jwt) {
        document.querySelector("#email").value = userInfo.email;
        document.querySelector("#name").value = userInfo.name;
    }
});

// Checkout form event listener
document.addEventListener("DOMContentLoaded", () => {
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            // Check if the cart is empty before proceeding
            const cartIsEmpty = await isCartEmpty(sub, jwt);
            if (cartIsEmpty) {
                // Bootstrap modal
                const modal = new bootstrap.Modal(document.getElementById('emptyCartModal'));
                modal.show();
                return;
            }

            // Proceed with form submission if cart is not empty
            const [address, city, zip, country] = ['address', 'city', 'zip', 'country'].map(id => document.getElementById(id)?.value.trim());
            if (![address, city, zip, country].every(Boolean)) return alert("Please fill in all fields before submitting.");
            try {
                const response = await fetch("https://order-service-api-order-service.2.rahtiapp.fi/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${jwt}` },
                    body: JSON.stringify({ shipping_address: `${address}, ${city}, ${zip}, ${country}` })
                });
                if (response.ok) window.location.href = "../pages/submitorder.html";
                else console.error("Error:", response.statusText);
            } catch (error) {
                console.error("Error:", error);
            }
        });
    }
});
