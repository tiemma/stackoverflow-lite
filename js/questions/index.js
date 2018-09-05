const answers_template = `<div class='answer pd-t-1 full-width' data-answerid='%answerid%' id='answer%answerid%'>
                <div class='headline pd-l-1' title='Summary of the answer provided'>%headline%</div>
                <div class='description padding-1'>
                    <div class='votes'>
                        <span class='up' title='Upvote'></span>
                        <span class='vote' title='Difference of upvotes and downvotes'>%votes%</span>
                        <span class='down' title='Downvote'></span>
                    </div>
                    <div class='text padding-1' title='Content of the answer'> %content%</div>
                </div>

                <div class='answer-details flex-end right'>
                    <span class='created' title='Username of answer provider'>
                        answered by <code title='%name%'>%username%</code>
                    </span>
                    <span class='created-at' title='Date the answer was provided'>
                         on <code>%created%</code>
                    </span>
                </div>
                <div class='comments margin-1'></div>
            </div>`;

const comments_template = `<div class='comment pd-t-1 mg-l-4'>
                <div class='description padding-1'>
                    <div class='votes'>
                        <span class='up' title='Upvote'></span>
                        <span class='vote' title='Difference of upvotes and downvotes'>%votes%</span>
                        <span class='down' title='Downvote'></span>
                    </div>
                    <div class='text padding-1' title='Content of the answer'> %content%</div>
                </div>

                <div class='answer-details flex-end right'>
                    <span class='created' title='Username of answer provider'>
                        commented by <code title='%name%'>%username%</code>
                    </span>
                    <span class='created-at' title='Date the answer was provided'>
                         on <code>%created%</code>
                    </span>
                </div>
                <hr />
            </div>`;

const questions_template = `   <div class='questions shadow-depth-2 bg-white margin-1 padding-1'>
        <div class='headline' title='Title the user gave the question'>
            <h1>%headline%</h1>
        </div>
        <div class='details margin-1' title='Details about the question asked'>
            <code>
                %content%
            </code>
        </div>
        <div class='answers full-width'>
            <div class='flex-end left'>Answers</div>
            <hr />

            <section class='answer-loader'>
                <div class='showbox'>
                    <div class='loader'>
                        <svg class='circular' viewBox='25 25 50 50'>
                            <circle class='path' cx='50' cy='50' r='20' fill='none' stroke-width='2' stroke-miterlimit='10'></circle>
                        </svg>
                    </div>
                </div>
            </section>

            <form method='post' action='/questions/%question-id%' class='tr-y-1'>
                <textarea title='Add Answer' placeholder='What's your answer?' rows='10' name='answer' id='answer-input' class='full-width'></textarea>
                <div class='input-field margin-1 flex-end'>
                    <input type='submit' value='Submit Answer' />
                </div>
            </form>
            <hr />
        </div>
        <div class='footer-details flex-end mg-bt-1'>
            <div class='read-more' title="Show all answers" data-questionid='%question-id%'>Show Answers</div>
            <div class='created-at' title="Date and time the answer was created">%created%</div>
            <div class='accepted' title='Answer has been accepted'></div>
            <div class='votes' title='Number of votes the question has'>%votes%</div>
        </div>
    </div>`;

const url = `http://localhost:3000/api/v1`;

fetchQuestions = () => {
    getDataWithoutBody(`${url}/questions/`, 'GET')
        .then(response => response.json())
        .then(response => {
            questionsNode = document.querySelector('div#questions');
            response['questions'].forEach((question)=>{
                let headline = question['headline'];
                let votes = question['votes'];
                let content = question['description'];
                let created = question['created'];
                let id = question['id'];
                let temp_questions_template = questions_template
                    .replace('%headline%', headline)
                    .replace('%votes%', votes)
                    .replace('%content%', content)
                    .replaceAll('%question-id%', id)
                    .replace('%created%', formatDate(created));
                questionsNode.insertAdjacentHTML('afterbegin', temp_questions_template);
            });
            setTimeout(() => {
                initPage();
            }, 500);
        })
        .catch(error => console.error(error));

};


showOrHideOtherQuestions = (e) => {
    var bodyNode = document.querySelector('body');

    if(bodyNode.classList.contains('show-question')){
        bodyNode.classList.remove('show-question');
        e.target.innerHTML = 'Show Answers';
        e.target.closest('.questions').classList.remove('show');
        return;
    }

    bodyNode.classList.add('show-question');
    e.target.closest('.questions').classList.add('show');
    e.target.innerHTML = 'Close';
    fetchAnswers(e);
};

formatDate = (date) => {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(date.replaceAll('\'', '').replaceAll('\"', '')).toLocaleDateString('en-US', options);
};

loadAnswersAndComments = (e) => {

};

fetchAnswers = (e) => {
    answersNode = e.target.closest('.questions').querySelector('.answers');
    getDataWithoutBody(`${url}/questions/` + e.target.dataset.questionid, 'GET')
        .then(response => response.json())
        .then((response) => {
            if (!answersNode.classList.contains('show')) {
                response['answers'].forEach((answer) => {
                    let headline = answer['answer']['headline'];
                    let votes = answer['answer']['votes'];
                    let content = answer['answer']['description'];
                    let created = answer['answer']['created'];
                    let user_username = answer['user_username'];
                    let user_name = answer['user_name'];
                    let id = answer['answer']['id'];

                    temp_questions_template = answers_template
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
                        temp_comment_template = comments_template
                            .replace('%votes%', votes)
                            .replace('%content%', content)
                            .replace('%created%', formatDate(created))
                            .replace('%username%', user_username)
                            .replace('%name%', user_name);
                        answersNode.querySelector(`#answer${id} .comments`).innerHTML =  "<div class='flex-end left comment-header'>Comments</div><hr />";
                        answersNode.querySelector(`#answer${id} .comments`).insertAdjacentHTML('beforeend', temp_comment_template);
                    })

                });
            }
            setTimeout(() => {
                answersNode.classList.add('show');
                createEventListeners();
            }, 500);
        })
        .catch(error => console.error(error));
};
