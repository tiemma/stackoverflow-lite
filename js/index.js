loadLogin = () => {
    if(typeof window.JWT_KEY === 'undefined'){
        fetch("./signup").
        then(response => response.text()).
        then((response) => {
            document.querySelector("section#content").innerHTML = response;
            setTimeout(createEventListeners, 2000);
            console.log("Login page loaded completely");
        });
    }
};


//Close loader once page loads
window.onload = () => {
    setTimeout(() => {
        document.querySelector("section#loader").style.display = "none";
        document.querySelector("section#content").style.display = "block";
    }, 1000);

    loadLogin();
};

