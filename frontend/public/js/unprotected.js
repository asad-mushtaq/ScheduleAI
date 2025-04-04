const userId = localStorage.getItem("userId");

if (userId !== null && userId !== undefined) {
    window.location.replace("/home");
}


