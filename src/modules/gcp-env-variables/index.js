'use strict';

function createUser(req, res) {
  console.log('PASSWORD_ITERATIONS: ', process.env.PASSWORD_ITERATIONS);
  console.log('PASSWORD_DERIVED_KEY_LENGTH: ', process.env.PASSWORD_DERIVED_KEY_LENGTH);
  console.log('EMAIL_SERVICE_API_KEY: ', process.env.EMAIL_SERVICE_API_KEY);

  res.status(200).send('User created');
}

function resetPassword(req, res) {
  console.log('EMAIL_SERVICE_API_KEY: ', process.env.EMAIL_SERVICE_API_KEY);

  res.status(200).send('Password sent.');
}

module.exports = {
  createUser,
  resetPassword
};
