const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateAddClient(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.phone = !isEmpty(data.phone) ? data.phone : '';
  data.address = !isEmpty(data.address) ? data.address : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Это поле обязательное';
  }

  if (Validator.isEmpty(data.phone)) {
    errors.phone = 'Это поле обязательное';
  }

  if (Validator.isEmpty(data.address)) {
    errors.address = 'Это поле обязательное';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}