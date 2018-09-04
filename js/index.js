
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

getDataWithoutBody = (url = ``, method=``) => {
    // Default options are marked with *
    return fetch(url, {
        mmethod: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
    });
};

postData = (url = ``, data = {}, method=``) => {
    // Default options are marked with *
    return fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data), // body data type must match 'Content-Type' header
    });
};

loadLogin = () => {
    if(localStorage.getItem('token') === null){
        getDataWithoutBody('./signup', 'GET').
        then(response => response.text()).
        then((response) => {
            document.querySelector('section#content').innerHTML = response;
            console.log('Login page loaded completely');
            initPage();
        });
    }else{
        loadDashboard();
    }
};

loadDashboard = () => {
    getDataWithoutBody('./templates', 'GET').
    then(response => response.text()).
    then((response) => {
        document.querySelector('section#content').innerHTML = response;
        fetchQuestions();
    });
};

createEvents = (element, func) => {
    Array.from(document.querySelectorAll(element)).forEach(function(elem) {
        elem.addEventListener('click', func, false);
    });
};

createEventListeners = () => {
    createEvents('div.read-more', showOrHideOtherQuestions);
    createEvents('#register-button', () => {toggleAuth('register')});
    createEvents('#login-button', toggleAuth);
    createEvents('input[type=submit]', submitFormData);
    console.log('Auth functions loaded');
};

initPage = () => {
    document.querySelector('section#loader').style.display = 'none';
    document.querySelector('section#content').style.display = 'block';
    createEventListeners();
};

//Close loader once page loads
window.onload = () => {
    setTimeout(() => {
        loadLogin();
    }, 2000);
};


