import rp from 'request-promise';

class ItEbookService {
  constructor(public resourceUrl: string | undefined) {
    if (!resourceUrl) {
      console.error('resourceUrl is required');
    }
  }
  public async search(query: string, page?: number) {
    const uri = page ? `${this.resourceUrl}/search/${query}/page/${page}` : `${this.resourceUrl}/search/${query}`;
    return new Promise((resolve, reject) => {
      const options = { uri, json: true };
      return rp(options)
        .then(data => {
          const { Error: error, Total: total, Books: books } = data;
          if (error !== '0') {
            return Promise.reject(error);
          }
          return Promise.resolve({ total, books });
        })
        .then(data => {
          console.log('Search Books Successfully');
          return resolve(data);
        })
        .catch(err => {
          const msg: string = err instanceof Error ? err.message : err;
          console.error(`Search Books failed. ${new Error(msg)}`);
          reject(msg);
        });
    });
  }
}

export { ItEbookService };
