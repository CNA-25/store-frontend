console.log("addToWishlist.js")

// API call to add to wishlist
//format : { "user_id": 2,
//  "sku": "123-ABC",
//  "name": "Lager",
//  "price": 55.99,
//  "description": "En ljus och frisk lager med balanserad smak." }
//  Response: { "message": "Product added to wishlist" }
async function addItemToWishlist(userId, sku, name, price, description) {
    const url = `http://localhost:8001/wishlist/`
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            //"Authorization": `${jwt}`, // Send token in header
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: userId,
            sku: sku,
            name: name,
            price: price,
            description: description
        })
    })
    if (!response.ok) {
        const errorData = await response.json()
        console.error('Error Data:', errorData)
        throw new Error(`Failed to add item: ${response.statusText} - ${JSON.stringify(errorData)}`)
    }
    return response.json() // Return the response data
}

// HARDCODED BEERS and USERID
const user_id = 1 // Replace with actual user ID
beers = [
    {
        user_id: user_id,
        sku: '123-ABC',
        name: "Lager",
        price: 55.99,
        description: "En ljus och frisk lager med balanserad smak."
    },
    {
        user_id: user_id,
        sku: '124-ABD',
        name: "Ale",
        price: 65.99,
        description: "En ljus och frisk ale med väldigt balanserad smak."
    },
    {
        user_id: user_id,
        sku: '125-ABE',
        name: "IPA",
        price: 75.99,
        description: "En ljus och frisk IPA med obalanserad smak."
    }
]
// Add eventlisteners to ADD to WISHLIST buttons 
document.querySelectorAll(".btn-add-wishlist").forEach((button, index) => {
    button.addEventListener("click", function() {
        addItemToWishlist(
            beers[index].user_id,
            beers[index].sku,
            beers[index].name,
            beers[index].price,
            beers[index].description
        )
        handleToast("Lager")
    })
})

// function to handle toast notification for adding to wishlist
function handleToast(beer) {
    const toastTrigger = beer
    const toastLiveExample = document.getElementById('liveToast')

    if (toastTrigger) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()
    }
}