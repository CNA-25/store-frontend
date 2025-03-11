document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const api_url = "https://user-service-api-user-service.2.rahtiapp.fi/login"; // backend url

    try {
        const response = await fetch(api_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("User not found.");
            } else if (response.status === 401) {
                throw new Error("Invalid credentials.");
            } else {
                throw new Error("Something went wrong.");
            }
        }

        const data = await response.json(); // svar från servern
        console.log("Backend data:" + data);
        const token = data.access_token; // jwt token från backend

        localStorage.setItem("jwt", "Bearer " + token); 
        window.location.href = "./cart.html"; // byt till rätt sida

    } catch (error) {
        console.error("Login failed:", error.message);
        alert(error.message);
    }
});