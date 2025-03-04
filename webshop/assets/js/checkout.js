document.getElementById("checkout-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const zip = document.getElementById("zip").value;
    const country = document.getElementById("country").value;
    
    const api_url = "https://order-service-api-order-service.2.rahtiapp.fi/api/orders"; // backend url

    const formData = {
        shipping_address: address + ", " + city + ", " + zip + ", " + country
    };

    try {
        const response = await fetch(api_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("jwt")

            },
            body: JSON.stringify(formData)
        });


        if (response.ok) {
            const data = await response.json();
            console.log(data);
            window.location.href = "../pages/submitorder.html";
        } else {
            console.error("Error:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
});