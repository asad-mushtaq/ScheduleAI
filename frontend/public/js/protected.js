const userId = localStorage.getItem("userId");

if (userId === null) {
    window.location.replace("/");
}


