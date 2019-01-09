const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateLoginInput(data) {
  const errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  if (!Validator.isLength(data.text, {min : 10, max : 300})) errors.text = 'Text must be have a character from 10 to 300';

  if (Validator.isEmpty(data.text)) {
    errors.text = 'Text field is required';
  }



  return {
    errors,
    isValid: isEmpty(errors)
  };
};