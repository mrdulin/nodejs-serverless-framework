exports.getBar = (request, response) => {
  response.status(200).send('get bar');
};

exports.deleteBar = (request, response) => {
  response.status(200).send('delete bar');
};
