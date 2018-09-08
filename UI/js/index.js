const initPage = () => {
  document.querySelector('section#loader').style.display = 'none';
  document.querySelector('section#content').style.display = 'block';
  createEventListeners();
};

const showSpinnerBeforeLoad = () => {
  document.querySelector('section#loader').style.display = 'block';
  document.querySelector('section#content').style.display = 'none';
  createEventListeners();
};

const loadLogin = () => getDataWithoutBody(`${API_URL}/verify/token`, 'GET')
  .then(response => response.json())
  .then((response) => {
    if (!response.auth) {
      getDataWithoutBody('./templates/signup', 'GET')
        .then(response => response.text())
        .then((response) => {
          document.querySelector('section#content').innerHTML = response;
          console.log('Login page loaded completely');
          initPage();
        });
    } else {
      loadDashboard();
    }
  });

const loadDashboard = () => {
  showSpinnerBeforeLoad();
  getDataWithoutBody('./templates/questions', 'GET')
    .then(response => response.text())
    .then((response) => {
      document.querySelector('section#content').innerHTML = response;
      fetchQuestions();
      createEventListeners();
      initPage();
    });
};

const createEventListeners = () => {
  createEvents('div.read-more', showOrHideOtherQuestions);
  createEvents('#register-button', () => { toggleAuth('register'); });
  createEvents('#logout-button',  logout );
  createEvents('#login-button', toggleAuth);
  createEvents('#auth input[type=submit]', submitAuthFormData);
  createEvents('.submit-question', submitCreateQuestionData);
  createEvents('#header #create-question-button', () => {
    document.querySelector('body').classList.add('show-create-question');
  });
  createEvents('.questions #create-question-button', () => {
    document.querySelector('body').classList.add('show-create-question');
  });
  createEvents('.questions #create-answer-button', createAnswers);
  createEvents('#close-create-button', (e) => {
    document.querySelector('body').classList.remove(e.target.dataset.target);
  });
  console.log('Event listener functions loaded');
};


// Close loader once page loads
window.onload = () => {
  setTimeout(() => {
    loadLogin();
  }, 2000);
};
