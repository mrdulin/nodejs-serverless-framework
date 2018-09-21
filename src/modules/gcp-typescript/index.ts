'use strict';

import rp from 'request-promise';

const api: string = 'http://it-ebooks-api.info/v1';

function searchBook(req, res) {
  const { query = '', page = 1 } = req.body;
  const uri = `${api}/search/${query}/page/${page}`;
  console.log('uri: ', uri);
  const options = {
    uri,
    json: true
  };
  rp(options)
    .then((data: any) => {
      const { Error: error, Total: total, Books: books } = data;
      console.log(error, total, books);
      if (error !== '0') {
        return Promise.reject(error);
      }
      return Promise.resolve({ total, books });
    })
    .then(data => res.json(data))
    .catch(err => {
      let msg: string;
      if (err instanceof Error) {
        console.error(err);
        msg = err.message;
      } else {
        console.error(new Error(err));
        msg = err;
      }
      res.status(500).send(msg);
    });
}

export { searchBook };
