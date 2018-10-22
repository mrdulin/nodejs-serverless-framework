import { ItEbookService } from '../../../services';

const { IT_EBOOKS_API } = process.env;
const itebookService = new ItEbookService(IT_EBOOKS_API);

function search(req, res) {
  console.log('process.env', process.env);
  if (!IT_EBOOKS_API) {
    const errMsg = 'process.env.IT_EBOOKS_API is required';
    console.error(errMsg);
    return res.status(500).send(errMsg);
  }
  const { query = '', page = 1 } = req.body;
  itebookService
    .search(query, page)
    .then(data => {
      res.json(data);
    })
    .catch(msg => {
      res.status(500).send(msg);
    });
}

export { search };
