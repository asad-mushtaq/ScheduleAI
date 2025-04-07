const userId = localStorage.getItem("userId");

function clearSession() {
    localStorage.removeItem("userId");
    window.location.replace("/login");
}

if (userId === null || userId === undefined) {
    window.location.replace("/");
}


