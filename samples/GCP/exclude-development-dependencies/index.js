'use strict';

const _ = require('lodash');

exports.excludeDevDependencies = (request, response) => {
  const msg = _.join(['Hello', 'World!'], '~~~~');
  response.status(200).send(msg);
};
