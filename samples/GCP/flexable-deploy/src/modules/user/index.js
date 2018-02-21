const { createUser } = require('./create');
const { deleteUser } = require('./delete');
const { readUser } = require('./read');
const { updateUser } = require('./update');

module.exports = {
  createUser,
  deleteUser,
  readUser,
  updateUser
};
