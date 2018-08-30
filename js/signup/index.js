showOrHideOtherQuestions = (e) => {
    // document.querySelectorAll(".questions").style.display = "none";

    var bodyNode = document.querySelector("body");

    if(bodyNode.classList.contains("show-question")){
        bodyNode.classList.remove("show-question");
        e.target.innerHTML = "Show Answer";
        e.target.closest(".questions").classList.remove("show");
        return;
    }

    bodyNode.classList.add("show-question");
    e.target.closest(".questions").classList.add("show");
    e.target.innerHTML = "Close";
};

fetchAnswers = () => {

};

