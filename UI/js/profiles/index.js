

const fetchCountsForProfile = () => {
  postData(`${API_URL}/questions/all/count`, { user_id: localStorage.getItem('id') }, 'POST')
    .then(resp => resp.json())
    .then((response) => {
      const hitsNode = document.querySelector('#profile-hits');
      const { question, answer, comment } = response.data;
      console.log(question);
      hitsNode.insertAdjacentHTML('beforeend', counterTemplate('Number of Questions Asked', question.count));
      hitsNode.insertAdjacentHTML('beforeend', counterTemplate('Number of Answers Given', answer.count));
      hitsNode.insertAdjacentHTML('beforeend', counterTemplate('Number of Comments Dropped', comment.count));
    });
};
