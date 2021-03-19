const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateCompleteOrder(data) {
  let errors = {};

  if (Validator.isEmpty(data.consumption)) {
    errors.consumption = 'Это поле обязательное';
  }

  if (Validator.isEmpty(data.paymentMethod)) {
    errors.paymentMethod = 'Это поле обязательное';
  }

  if (Validator.isEmpty(data.cost)) {
    errors.cost = 'Это поле обязательное';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}