
createQuestions = (response) => {
  const questionsNode = document.querySelector('div#questions');
  response.questions.forEach((question) => {
    const headline = question.headline;
    const votes = question.votes;
    const content = question.description;
    const created = question.created;
    const id = question.id;
    const temp_questions_template = questions_template()
      .replace('%headline%', headline)
      .replace('%votes%', votes)
      .replace('%content%', content)
      .replaceAll('%question-id%', id)
      .replace('%created%', formatDate(created));
    questionsNode.insertAdjacentHTML('afterbegin', temp_questions_template);
  });
};

fetchQuestions = () => {
  getDataWithoutBody(`${API_URL}/questions/`, 'GET')
    .then(response => response.json())
    .then((response) => {
      createQuestions(response);
      document.querySelector('body').insertAdjacentHTML('afterbegin', create_question_template());
      setTimeout(() => {
        initPage();
      }, 500);
    })
    .catch(error => console.error(error));
};

createAnswers = (e) => {
  document.querySelector('section#create-answer-section').innerHTML = create_answer_template(e.target.dataset.questionid);
  document.querySelector('body').classList.add('show-create-answer');
  createEventListeners();
};


showOrHideOtherQuestions = (e, reload) => {
  const bodyNode = document.querySelector('body');

  if (bodyNode.classList.contains('show-question') && !reload) {
    bodyNode.classList.remove('show-question');
    e.target.innerHTML = 'Show Answers';
    e.target.closest('.questions').classList.remove('show');
    return;
  }

  bodyNode.classList.add('show-question');
  e.target.closest('.questions').classList.add('show');
  e.target.innerHTML = 'Close';
  fetchAnswers(e, reload);
};


fetchAnswers = (e, reload) => {
  const answersNode = e.target.closest('.questions').querySelector('.answers');
  getDataWithoutBody(`${API_URL}/questions/${e.target.dataset.questionid}`, 'GET')
    .then(response => response.json())
    .then((response) => {
      if (!answersNode.classList.contains('show') || reload) {
        response.answers.forEach((answer) => {
          const headline = answer.answer.headline;
          const votes = answer.answer.votes;
          const content = answer.answer.description;
          const created = answer.answer.created;
          const user_username = answer.user_username;
          const user_name = answer.user_name;
          const id = answer.answer.id;

          const temp_questions_template = answers_template()
            .replace('%headline%', headline)
            .replace('%votes%', votes)
            .replaceAll('%answerid%', id)
            .replace('%content%', content)
            .replace('%created%', formatDate(created))
            .replace('%username%', user_username)
            .replace('%name%', user_name);

          answersNode.querySelector('hr').insertAdjacentHTML('afterend', temp_questions_template);

          answer.comments.forEach((comment) => {
            const votes = comment.comment.votes;
            const content = comment.comment.comment;
            const created = comment.comment.created;
            const user_username = comment.user_username;
            const user_name = comment.user_name;
            const temp_comment_template = comments_template()
              .replace('%votes%', votes)
              .replace('%content%', content)
              .replace('%created%', formatDate(created))
              .replace('%username%', user_username)
              .replace('%name%', user_name);
            answersNode.querySelector(`#answer${id} .comments`).innerHTML = "<div class='flex-end left comment-header'>Comments</div><hr />";
            answersNode.querySelector(`#answer${id} .comments`).insertAdjacentHTML('beforeend', temp_comment_template);
          });
        });
      }
      setTimeout(() => {
        answersNode.classList.add('show');
      }, 500);
      createEventListeners();
    })
    .catch(error => console.error(error));
};

submitCreateQuestionData = (event) => {
  const formData = getFormData(event);
  const formObject = getFormObject(event);
  if (formData.headline === '' || formData.description === '') {
    formObject.querySelector('.error').innerHTML = 'Kindly fill all fields';
    return;
  }
  postData(`${API_URL}${formObject.attributes.action.nodeValue}`, formData, 'POST')
    .then(resp => resp.json())
    .then((resp) => {
      if (resp.success === true) {
        document.querySelector('body').classList.remove('show-create-question');
        document.querySelector('body').classList.remove('show-create-answer');
        const showNode = document.querySelector(`div.read-more[data-questionid="${event.target.dataset.questionid}"]`);
        showNode.target = showNode;
        showOrHideOtherQuestions(showNode, true);
        // location.reload(true);
      } else {
        formObject.querySelector('.error').innerHTML = resp.error;
      }
    });
};
