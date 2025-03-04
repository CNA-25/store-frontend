
document.addEventListener("DOMContentLoaded", function() {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = `
        <div class="message">Thank you for your order!</div>
        <div class="redirect">You will be redirected shortly...</div>
    `;

    setTimeout(function() {
        window.location.href = "./store.html";
    }, 5000); // Redirect after 5 seconds
});
