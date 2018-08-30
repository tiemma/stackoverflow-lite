
toggleAuth = (id) => {

    let hide  = "none";
    let show = "block";
    let toggle = [hide, show];

    let withoutId  = "";
    let withId = "active";
    let idToggle = [withoutId, withId];

    if(id === "register") {
        toggle.reverse();
        idToggle.reverse()
    }

    document.querySelector(".register-body").style.display = toggle[0];
    document.querySelector(".login-body").style.display = toggle[1];

    document.querySelector(".register").id = idToggle[0];
    document.querySelector(".login").id = idToggle[1];

};



