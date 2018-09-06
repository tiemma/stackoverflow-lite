
createQuestions = (response) => {
    let questionsNode = document.querySelector('div#questions');
    response['questions'].forEach((question)=>{
        let headline = question['headline'];
        let votes = question['votes'];
        let content = question['description'];
        let created = question['created'];
        let id = question['id'];
        let temp_questions_template = questions_template()
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
        .then(response => {
            createQuestions(response);
            document.querySelector("body").insertAdjacentHTML('afterbegin', create_question_template());
            setTimeout(() => {
                initPage();
            }, 500);
        })
        .catch(error => console.error(error));
};

createAnswers = (e) => {
    document.querySelector("section#create-answer-section").innerHTML = create_answer_template(e.target.dataset.questionid);
    document.querySelector('body').classList.add("show-create-answer");
    createEventListeners();
};


showOrHideOtherQuestions = (e, reload) => {
    let bodyNode = document.querySelector('body');

    if(bodyNode.classList.contains('show-question') && !reload){
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
    let answersNode = e.target.closest('.questions').querySelector('.answers');
    getDataWithoutBody(`${API_URL}/questions/` + e.target.dataset.questionid, 'GET')
        .then(response => response.json())
        .then((response) => {
            if (!answersNode.classList.contains('show') || reload) {
                response['answers'].forEach((answer) => {
                    let headline = answer['answer']['headline'];
                    let votes = answer['answer']['votes'];
                    let content = answer['answer']['description'];
                    let created = answer['answer']['created'];
                    let user_username = answer['user_username'];
                    let user_name = answer['user_name'];
                    let id = answer['answer']['id'];

                    let temp_questions_template = answers_template()
                        .replace('%headline%', headline)
                        .replace('%votes%', votes)
                        .replaceAll('%answerid%', id)
                        .replace('%content%', content)
                        .replace('%created%', formatDate(created))
                        .replace('%username%', user_username)
                        .replace('%name%', user_name);

                    answersNode.querySelector('hr').insertAdjacentHTML('afterend', temp_questions_template);

                    answer['comments'].forEach(comment => {
                        let votes = comment['comment']['votes'];
                        let content = comment['comment']['comment'];
                        let created = comment['comment']['created'];
                        let user_username = comment['user_username'];
                        let user_name = comment['user_name'];
                        let temp_comment_template = comments_template()
                            .replace('%votes%', votes)
                            .replace('%content%', content)
                            .replace('%created%', formatDate(created))
                            .replace('%username%', user_username)
                            .replace('%name%', user_name);
                        answersNode.querySelector(`#answer${id} .comments`).innerHTML =  "<div class='flex-end left comment-header'>Comments</div><hr />";
                        answersNode.querySelector(`#answer${id} .comments`).insertAdjacentHTML('beforeend', temp_comment_template);
                    });

                });
            }
            answersNode.classList.add('show');
            createEventListeners();
        })
        .catch(error => console.error(error));
};

submitCreateQuestionData = (event) => {
    let formData = getFormData(event);
    let formObject = getFormObject(event);
    if (formData.headline === "" || formData.description === ""){
        formObject.querySelector(".error").innerHTML = 'Kindly fill all fields';
        return;
    }
    postData(`${API_URL}${formObject.attributes.action.nodeValue}`, formData, 'POST')
        .then(resp => resp.json())
        .then((resp) => {
            if (resp.success === true) {
                document.querySelector("body").classList.remove('show-create-question');
                document.querySelector("body").classList.remove('show-create-answer');
                let showNode = document.querySelector(`div.read-more[data-questionid="${event.target.dataset.questionid}"]`);
                showNode.target = showNode;
                showOrHideOtherQuestions(showNode, true);
                // location.reload(true);
            } else {
                formObject.querySelector(".error").innerHTML = resp.error;
            }
        });
};
