// Load Profile Page
document.addEventListener("DOMContentLoaded", async () => {
    const profileFullName = document.getElementById("profile-fullname");
    const profileEmail = document.getElementById("profile-email");
    const profileSubLevel = document.getElementById("profile-subscription-level");

    const id = JSON.parse(localStorage.getItem("id"));
    if (id != null && id != undefined) {
        await fetch(`http://localhost:3000/v1/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
        }).then(async function (response) {
            console.log(response.status);
            const json = await response.json();
            console.log(json);
            if (!response.ok) {
                alert(json.errors[0].message);
                window.location.replace("/login");
            } else {
                profileFullName.textContent = "Full Name: " + json.firstName + " " + json.lastName;
                profileEmail.textContent = "Email: " + json.email;
            }
        })

        await fetch(`http://localhost:3000/v1/users/${id}/subscription`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
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
        profileFullName.textContent = "Full Name: N/A";
        profileEmail.textContent = "Email: N/A";
        profileSubLevel.textContent = "Subscription Level: N/A";
        window.location.replace("/login");
    }
});