import cp from 'child_process';
import rp from 'request-promise';
import path from 'path';

import { logger, FunctionEmulator } from '../../../util';

const functionName = 'searchBook';
const localPath = path.resolve(process.cwd(), 'src/modules/book');
const fnEmulator = new FunctionEmulator({ functionName });

beforeAll(() => {
  const options = {
    env: {
      ...process.env,
      IT_EBOOKS_API: 'http://it-ebooks-api.info/v1'
    }
  };

  cp.execSync(
    `cd ${localPath} &&
        functions start &&
        functions deploy ${functionName} --trigger-http`,
    options
  ).toString();
});

describe('book module test suites', () => {
  describe('searchBook test suites', () => {
    const baseUrl = fnEmulator.getBaseEndpoint();

    beforeEach(() => {
      fnEmulator.clearLogs();
    });

    it('should search book successfully', () => {
      fnEmulator.call({ query: 'nodejs' });
      const logs = fnEmulator.readLogs();
      expect(logs).toContain('Search Books Successfully');
    });

    it.skip('should return correct books when send a search request', async () => {
      expect.assertions(1);
      const uri = `${baseUrl}/searchBook`;
      logger.info(`uri: ${uri}`);
      const options = {
        method: 'POST',
        uri,
        body: {
          query: 'nodejs'
        },
        json: true
      };
      const data = await rp(options);
      expect(typeof data.total).toBe('string');
    });
  });
});
