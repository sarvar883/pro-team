const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.phone = !isEmpty(data.phone) ? data.phone : '';
  data.occupation = !isEmpty(data.occupation) ? data.occupation : '';
  data.color = !isEmpty(data.color) ? data.color : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Имя должно быть не менее 2 символов';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Это поле обязятельное';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Это поле обязятельное';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Неправильный Email';
  }

  if (Validator.isEmpty(data.phone)) {
    errors.phone = 'Это поле обязятельное';
  }

  if (Validator.isEmpty(data.occupation)) {
    errors.occupation = 'Это поле обязятельное';
  }

  if ((data.occupation === 'disinfector' || data.occupation === 'subadmin') && Validator.isEmpty(data.color)) {
    errors.color = 'Выберите цвет дезинфектора';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Это поле обязятельное';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Длина пароля должна быть не менее 6 символов';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Это поле обязятельное';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Пароли не совпадают';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};