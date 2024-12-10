getUser("aurura0810@gmail.com")
    .then(user => console.log(user))
    .catch(error => console.error("Error fetching user:", error));