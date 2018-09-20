exports.getFoo = (request, response) => {
  response.status(200).send('get foo');
};

exports.deleteFoo = (request, response) => {
  response.status(200).send('delete foo');
};
