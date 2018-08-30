loadLogin = () => {
    if(typeof window.JWT_KEY === 'undefined'){
        fetch("./signup").
        then(response => response.text()).
        then((response) => {
            document.querySelector("section#content").innerHTML = response;
            console.log("Login page loaded completely");
        });
    }
};

loadDashboard = () => {
    fetch("./templates").
    then(response => response.text()).
    then((response) => {
        document.querySelector("section#content").innerHTML = response;
    });
};

createEventListeners = () => {
    Array.from(document.querySelectorAll(".read-more")).forEach(function(question) {
        question.addEventListener('click', showOrHideOtherQuestions, false);
    });
    document.querySelector("#register-button").addEventListener("click", () => {toggleAuth("register")}, false);
    document.querySelector("#login-button").addEventListener("click", toggleAuth, false);
    console.log("Auth functions loaded");
};

//Close loader once page loads
window.onload = () => {
    setTimeout(() => {
        document.querySelector("section#loader").style.display = "none";
        document.querySelector("section#content").style.display = "block";
        createEventListeners();
    }, 2000);

    loadDashboard();
    // loadLogin();
};


