const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateOrderInput(data) {
  let errors = {};

  data.disinfectorId = !isEmpty(data.disinfectorId) ? data.disinfectorId : '';
  data.userAcceptedOrder = !isEmpty(data.userAcceptedOrder) ? data.userAcceptedOrder : '';
  data.client = !isEmpty(data.client) ? data.client : '';
  data.clientType = !isEmpty(data.clientType) ? data.clientType : '';
  data.clientId = !isEmpty(data.clientId) ? data.clientId : '';
  data.address = !isEmpty(data.address) ? data.address : '';
  data.date = !isEmpty(data.date) ? data.date : '';
  data.timeFrom = !isEmpty(data.timeFrom) ? data.timeFrom : '';
  data.phone = !isEmpty(data.phone) ? data.phone : '';
  data.advertising = !isEmpty(data.advertising) ? data.advertising : '';

  if (Validator.isEmpty(data.disinfectorId)) {
    errors.disinfectorId = 'Это поле обязательное';
  }

  if (Validator.isEmpty(data.userAcceptedOrder)) {
    errors.userAcceptedOrder = 'Это поле обязательное';
  }

  if (Validator.isEmpty(data.client)) {
    errors.client = 'Это поле обязательное';
  }

  if (Validator.isEmpty(data.clientType)) {
    errors.clientType = 'Выберите тип клиента';
  }

  if (data.clientType === 'corporate' && Validator.isEmpty(data.clientId)) {
    errors.clientId = 'Выберите корпоративного клиента';
  }

  if (Validator.isEmpty(data.address)) {
    errors.address = 'Это поле обязательное';
  }

  if (Validator.isEmpty(data.phone)) {
    errors.phone = 'Это поле обязательное';
  }
  if (Validator.isEmpty(data.date)) {
    errors.date = 'Это поле обязательное';
  }

  if (Validator.isEmpty(data.timeFrom)) {
    errors.timeFrom = 'Это поле обязательное';
  }

  if (Validator.isEmpty(data.advertising)) {
    errors.advertising = 'Это поле обязательное';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};