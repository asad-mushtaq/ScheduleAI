// Store users in localStorage
function signUp() {
    const fullName = document.getElementById("signup-fullname").value;
    const email = document.getElementById("signup-email").value;
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    if (fullName && email && username && password) {
        const userData = { fullName, email, username, password };
        localStorage.setItem("user", JSON.stringify(userData));
        alert("Sign up successful! You can now log in.");
        window.location.href = "profile.html";
    } else {
        alert("Please fill in all fields.");
    }
}

// Handle Login
function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && username === storedUser.username && password === storedUser.password) {
        alert("Login successful!");
        localStorage.setItem("loggedInUser", JSON.stringify(storedUser));
        window.location.href = "profile.html";
    } else {
        alert("Invalid credentials.");
    }
}

// Load Profile Page
document.addEventListener("DOMContentLoaded", () => {
    const profileFullName = document.getElementById("profile-fullname");
    const profileEmail = document.getElementById("profile-email");
    const profileUsername = document.getElementById("profile-username");

    if (profileUsername) {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (loggedInUser) {
            profileFullName.textContent = `Full Name: ${loggedInUser.fullName}`;
            profileEmail.textContent = `Email: ${loggedInUser.email}`;
            profileUsername.textContent = `Username: ${loggedInUser.username}`;
        } else {
            profileUsername.textContent = "Username: Guest";
            profileFullName.textContent = "Full Name: N/A";
            profileEmail.textContent = "Email: N/A";
        }
    }
});

// Logout
function logout() {
    localStorage.removeItem("loggedInUser");
    alert("Logged out!");
    window.location.href = "index.html";
}
