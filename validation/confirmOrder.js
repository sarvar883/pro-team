const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateConfirmedOrder(data) {
  let errors = {};

  if (Validator.isEmpty(data.clientReview)) {
    errors.clientReview = 'Это поле обязательное';
  }

  if (Validator.isEmpty(data.score)) {
    errors.score = 'Это поле обязательное';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}