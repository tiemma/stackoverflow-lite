
const counterTemplate = (caption, count) => ` 
 <div class='questions shadow-depth-2 bg-white margin-1 padding-1 red-dashed pointer'>
    <div class='headline' title='Title the user gave the question'>
        <h2>${caption}</h2>
    </div>
    <div class='details margin-1' title='Details about the question asked'>
        <code>
            ${count}
        </code>
    </div>
</div>`;
