

loadLogin = () => {
    if(localStorage.getItem('token') === null){
        getDataWithoutBody('./templates/signup', 'GET').
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
    getDataWithoutBody('./templates/questions', 'GET').
    then(response => response.text()).
    then((response) => {
        document.querySelector('section#content').innerHTML = response;
        fetchQuestions();
        createEventListeners();
    });
};

createEventListeners = () => {
    createEvents('div.read-more', showOrHideOtherQuestions);
    createEvents('#register-button', () => {toggleAuth('register')});
    createEvents('#login-button', toggleAuth);
    createEvents('#auth input[type=submit]', submitAuthFormData);
    createEvents('#submit-question', submitCreateQuestionData);
    createEvents('#submit-answer', (e) => {
        submitCreateQuestionData(e);
        document.querySelector("body")
    });
    createEvents('#header #create-question-button', () => {
    createEvents('#header #create-question-button', () => {
        document.querySelector("body").classList.add('show-create-question');
    });
    createEvents('.questions #create-question-button', () => {
        document.querySelector("body").classList.add('show-create-question');
    });
    createEvents('.questions #create-answer-button', createAnswers);
    createEvents('#close-create-button', (e) => {
        document.querySelector("body").classList.remove(e.target.dataset.target);
    });
    console.log('Event listener functions loaded');
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


