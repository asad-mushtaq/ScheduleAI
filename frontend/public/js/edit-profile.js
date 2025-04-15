document.addEventListener("DOMContentLoaded", async () => {
    const firstNameInput = document.getElementById("first-name");
    const lastNameInput = document.getElementById("last-name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const form = document.getElementById("edit-profile-form");

    const dbManagerUrl = "http://localhost:8080/db_manager"
    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("User not logged in.");
        window.location.href = "/login.html";
        return;
    }

    // Fetch and populate existing user info
    try {
        const res = await fetch(`${dbManagerUrl}/v1/users/${userId}`, {
            credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const user = await res.json();

        firstNameInput.value = user.firstName || "";
        lastNameInput.value = user.lastName || "";
        emailInput.value = user.email || "";
    } catch (err) {
        console.error("Error fetching user:", err);
        alert("Unable to load profile info.");
    }

    // Handle form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const updatedUser = {
            id: parseInt(userId),
            firstName: firstNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value.trim(),
        };

        try {
            const res = await fetch(`${dbManagerUrl}/v1/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(updatedUser),
            });

            if (!res.ok) {
                const text = await res.text(); // fallback in case it's not JSON
                throw new Error(text);
            }

            alert("Profile updated!");
            window.location.href = "/profile.html";
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("Error updating profile.");
        }
    });
});
