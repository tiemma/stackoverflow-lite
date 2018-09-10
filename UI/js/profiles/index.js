

const fetchCountsForProfile = () => {
  postData(`${API_URL}/questions/all/count`, { user_id: localStorage.getItem('id') }, 'POST')
    .then(resp => resp.json())
    .then((response) => {
      const hitsNode = document.querySelector('#profile-hits');
      const { question, answer, comment } = response.data;
      hitsNode.insertAdjacentHTML('beforeend', counterTemplate('Number of Questions Asked', question.count));
      hitsNode.insertAdjacentHTML('beforeend', counterTemplate('Number of Answers Given', answer.count));
      hitsNode.insertAdjacentHTML('beforeend', counterTemplate('Number of Comments Dropped', comment.count));
    });
};

const fetchRecentQuestions = () => {
  const count = 15; // Only selecting the most recent 15 questions
  getDataWithoutBody(`${API_URL}/questions/recent/${count}`, 'GET')
    .then(resp => resp.json())
    .then((response) => {
      createQuestions(response.data);
    });
};

const fetchPopularQuestions = () => {
  const count = 15; // Only selecting the most popular 15 questions
  postData(`${API_URL}/questions/popular/${count}`, { user_id: localStorage.getItem('id') }, 'POST')
    .then(resp => resp.json())
    .then((response) => {
      createQuestions(response.data, '#questions-with-most-answers-list');
    });
};
