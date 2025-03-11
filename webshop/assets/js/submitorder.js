document.addEventListener("DOMContentLoaded", function() {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = `
        <div class="container d-flex justify-content-center align-items-center vh-100">
            <div class="card p-5" style="background-color: #E5C7A1; width: 100%; max-width: 500px;">
                <div class="message text-center">
                    <h3>Thank you for your order!</h3>
                </div>
                <div class="redirect text-center mt-3">
                    <p>You will be redirected shortly...</p>
                </div>
            </div>
        </div>
    `;

    setTimeout(function() {
        window.location.href = "./store.html";
    }, 3000); // Redirect after 3 seconds
});
