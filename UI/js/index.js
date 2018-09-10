let API_URL = 'https://stackoverflow-lite-api-node.herokuapp.com/api/v1';
if (sessionStorage.getItem('dev') === 'true') API_URL = 'http://localhost:3000/api/v1';

const initPage = () => {
  setTimeout(
    () => {
      document.querySelector('section#loader').style.display = 'none';
      document.querySelector('section#content').style.display = 'block';
      createEventListeners();
    }, 1000,
  );

  return true;
};

const showSpinnerBeforeLoad = () => {
  document.querySelector('section#loader').style.display = 'block';
  document.querySelector('section#content').style.display = 'none';
  createEventListeners();
};

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


const loadProfile = () => {
  showSpinnerBeforeLoad();
  getDataWithoutBody('./templates/profile', 'GET')
    .then(response => response.text())
    .then((response) => {
      document.querySelector('section#content').innerHTML = response;
      fetchCountsForProfile();
      fetchRecentQuestions();
      fetchPopularQuestions();
      createEventListeners();
      initPage();
    });
};

const loadLogin = () => getDataWithoutBody('./templates/signup', 'GET')
  .then(response => response.text())
  .then((response) => {
    document.querySelector('section#content').innerHTML = response;
    console.log('Login page loaded completely');
    return initPage();
  });

const val = null;
const createEventListeners = () => {
  createEvents('div.read-more', showOrHideOtherQuestions);
  createEvents('.questions', (e) => {
    e.target.closest('.questions').querySelector('div.read-more').click();
  });
  createEvents('#register-button', () => { toggleAuth('register'); });
  createEvents('#logout-button', logout);
  createEvents('#view-profile-button', loadProfile);
  createEvents('#view-dashboard-button', loadDashboard);
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
    verifyToken(true);
  }, 2000);
};
