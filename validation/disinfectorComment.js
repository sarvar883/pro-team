const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateDisinfectorCommentInput(data) {
  let errors = {};

  data.comment = !isEmpty(data.comment) ? data.comment : '';

  if (Validator.isEmpty(data.comment)) {
    errors.disinfectorComment = 'Это поле обязательное';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}