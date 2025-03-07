// Function to decode JWT and extract the user ID
function getUserIdFromJWT(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1])) // Decode payload
        return payload.sub || payload.user_id // Adjust based on API structure
    } catch (e) {
        console.error("Invalid JWT", e)
        return null
    }
}

// Store jwt and userId globally if not already set
if (!window.jwt) {
    window.jwt = localStorage.getItem('jwt')
}
if (!window.userId) {
    window.userId = getUserIdFromJWT(window.jwt)
}
if (!window.userId) {
    console.error("User ID could not be extracted from JWT")
}