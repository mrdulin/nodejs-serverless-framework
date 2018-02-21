const faker = require('faker');

function createPost(req, res) {
  res.status(200).send(faker.lorem.sentence());
}

exports.createPost = createPost;
