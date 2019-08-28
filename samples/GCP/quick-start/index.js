'use strict';

exports.http = (request, response) => {
  response.status(200).send('Hello World!');
};

exports.event = (data, context, callback) => {
  console.log(`data: ${JSON.stringify(data)}`);
  console.log(`context: ${JSON.stringify(context)}`);

  callback(new Error('test error'));
};

exports.GCS = () => {
  console.log('GCS');
};
