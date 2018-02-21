const { createPost } = require('./create');
const { deletePost } = require('./delete');
const { readPost } = require('./read');
const { updatePost } = require('./update');

module.exports = {
  createPost,
  deletePost,
  readPost,
  updatePost
};
