const dbManagerUrl = "http://localhost:8080/db_manager"

function clearSession() {
    localStorage.removeItem("userId");
    window.location.replace("/login");
}
// Load Profile Page
document.addEventListener("DOMContentLoaded", async () => {
    const profileFullName = document.getElementById("profile-fullname");
    const profileEmail = document.getElementById("profile-email");
    const profileSubLevel = document.getElementById("profile-subscription-level");

    const userId = JSON.parse(localStorage.getItem("userId"));
    if (userId != null && userId != undefined) {
        await fetch(`${dbManagerUrl}/v1/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            credentials: 'include'
        }).then(async function (response) {
            console.log(response.status);
            const json = await response.json();
            console.log(json);
            if (!response.ok) {
                alert(json.errors[0].message);
                clearSession();
            } else {
                profileFullName.textContent = "Full Name: " + json.firstName + " " + json.lastName;
                profileEmail.textContent = "Email: " + json.email;
            }
        })

        await fetch(`${dbManagerUrl}/v1/users/${userId}/subscription`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            credentials: 'include'
        }).then(async function (response) {
            console.log(response.status);
            const json = await response.json();
            console.log(json);
            if (!response.ok) {
                alert(json.errors[0].message);
            } else {
                profileSubLevel.textContent = "Subscription Level: " + json.name;
            }
        })
    } else {
        clearSession();
    }
});