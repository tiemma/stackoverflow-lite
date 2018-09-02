const zip = (values, schema) => {
  const obj = {};
  values.map((e, i) => {
    obj[schema[i]] = e;
    return e;
  });
  return obj;
};

const parseStringArray = obj => obj.replace('(', '').replace(')', '').split(',').map(String);

const answerSchema = ['id', 'user_id', 'question_id',
  'headline', 'description', 'created',
  'edited', 'accepted', 'votes'];

const questionSchema = ['id', 'user_id', 'headline',
  'description', 'votes', 'created', 'edited'];

const commentSchema = ['id', 'user_id', 'question_id', 'answer_id',
  'comment', 'votes', 'created', 'edited'];


export {
  zip, parseStringArray, answerSchema, questionSchema, commentSchema,
};
