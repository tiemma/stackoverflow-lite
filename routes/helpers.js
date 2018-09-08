const referenceDoesNotExist = err => err.message.indexOf('violates foreign key constraint') > 0;

const isDuplicate = err => err.message.indexOf('duplicate key value violates unique constraint') > 0;

export { referenceDoesNotExist, isDuplicate };
