const answersTemplate = () => `
<div class='answer padding-half full-width red-dashed mg-bt-1' data-answerid='%answerid%' id='answer%answerid%'>
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
        <input type='submit' value='Add Comment' class="yellow-dashed padding-half pointer" id="create-comment-button" data-questionid='%question-id%' data-answer='%answerid%'/>
        <span class='created' title='Username of answer provider'>
            answered by <code title='%name%'>%username%</code>
        </span>
        <span class='created-at' title='Date the answer was provided'>
             on <code>%created%</code>
        </span>
    </div>
    <div class='comments margin-1'></div>
</div>`;

const commentTemplate = () => `
<div class='comment pd-t-1 mg-l-4'>
    <div class='description padding-1'>
        <div class='votes'>
            <span class='up pointer' title='Upvote'></span>
            <span class='vote' title='Difference of upvotes and downvotes'>%votes%</span>
            <span class='down pointer' title='Downvote'></span>
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

const questionTemplate = () => `
<div class='questions shadow-depth-2 bg-white margin-1 padding-1 red-dashed pointer'>
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

        <div class='input-field margin-1 flex-end'>
            <input type='submit' value='Create Answer' class="green-dashed padding-half pointer" id="create-answer-button" data-questionid='%question-id%'/>
        </div>
        <hr />
    </div>
    <div class='footer-details flex-end mg-bt-1'>
        <div class='read-more pointer' title="Show all answers" data-questionid='%question-id%'>Show Answers</div>
        <div class='created-at' title="Date and time the answer was created">%created%</div>
        <div class='accepted' title='Answer has been accepted'></div>
        <div class='votes' title='Number of votes the question has'>%votes%</div>
    </div>
</div>`;

const createQuestionTemplate = () => `
<div id="create-question">
    <form method='post' action='/questions' id="create-question-form" class='tr-y-1'>
        <code title='Error' class='error shadow-depth-2 padding-1'></code>
        <div class='questions shadow-depth-2 bg-white margin-1 padding-1 red-dashed'>
            <div class='headline input-field' title='Title the user gives the question'>
                <label for="headline">Headline</label>
                <input name="headline" type="text" required id="headline" placeholder="Headline for the question?" class='only-bt-bdr full-width pd-t-1'>
            </div>
            <div class='details mg-r-1' title='Details about the question asked'>               
                <label for="description">Description</label>
                <textarea title="Add Question's description" placeholder="What's your question?" rows='10' name='description' id='description' class='full-width padding-half'></textarea>
            </div>
            <input type="hidden" name="user_id" value="${localStorage.getItem('id')}" />
            <div class='input-field margin-1 flex-end'>
                <input type='submit' value='Submit Answer' class="green-dashed padding-half submit-question pointer" id="submit-question" data-target="create-question" />
                <button type='button' class="mg-l-1 red-dashed padding-half pointer" value='Close' id="close-create-button" data-target="show-create-question">Close Dialog</button>
            </div>
        </div>
    </form>
</div>`;

const createAnswerTemplate = question_id => `
<div id="create-answer">
    <form method='post' action='/questions/${question_id}/answers' id="create-answer-form" class='tr-y-1'>
        <code title='Error' class='error shadow-depth-2 padding-1'></code>
        <div class='answers shadow-depth-2 bg-white margin-1 padding-1 red-dashed'>
            <div class='headline input-field' title='Title the user gives the answer'>
                <label for="headline">Headline</label>
                <input name="headline" type="text" required  id="headline" placeholder="Headline for the answer?" class='only-bt-bdr full-width pd-t-1'>
            </div>
            <div class='details mg-r-1' title='Details about the question asked'>               
                <label for="description">Description</label>
                <textarea title="Add Answers's description" required placeholder="What's your answer?" rows='10' name='description' id='description' class='full-width padding-half'></textarea>
            </div>
            <input type="hidden" name="user_id" value="${localStorage.getItem('id')}" />
            <div class='input-field margin-1 flex-end'>
                <input type='submit' value='Submit Answer' class="green-dashed padding-half submit-question" id="submit-question" data-target="create-answer" data-questionid="${question_id}"/>
                <button type='button' class="mg-l-1 red-dashed padding-half" value='Close' id="close-create-button" data-target="show-create-answer">Close Dialog</button>
            </div>
        </div>
    </form>
</div>`;
