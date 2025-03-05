document.getElementById("checkout-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Get input values
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const zip = document.getElementById("zip").value.trim();
    const country = document.getElementById("country").value.trim();
    const jwt = localStorage.getItem("jwt");

    // Check for empty fields
    if (!address || !city || !zip || !country) {
        alert("Please fill in all fields before submitting.");
        return;
    }

    const api_url = "https://order-service-api-order-service.2.rahtiapp.fi/api/orders"; // backend url

    const formData = {
        shipping_address: `${address}, ${city}, ${zip}, ${country}`,
    };

    try {
        const response = await fetch(api_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${jwt}`
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
