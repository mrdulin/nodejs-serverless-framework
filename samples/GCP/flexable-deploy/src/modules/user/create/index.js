const faker = require('faker');

function createUser(req, res) {
  res.status(200).send(faker.name.findName());
}

exports.createUser = createUser;
