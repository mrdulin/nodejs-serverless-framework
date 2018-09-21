import cp from 'child_process';
import rp from 'request-promise';

import { logger } from '../../util/logger';

jest.setTimeout(30000);

function clearLogs() {
  console.log('clear functions logs');
  cp.execSync('functions logs clear');
}

describe('gcp-typescript test suites', () => {
  const configJSON: string = cp.execSync('functions config list --json').toString();
  const config = JSON.parse(configJSON);
  const baseUrl = `http://${config.host}:${config.supervisorPort}/${config.projectId}/${config.region}`;

  describe('searchBook', () => {
    beforeEach(() => {
      clearLogs();
    });

    it.skip('Test', () => {
      const startTime = new Date(Date.now()).toISOString();
      const data = JSON.stringify({ query: 'nodejs' });

      cp.execSync(`$(npm bin)/functions call searchBook --data '${data}'`);

      const logs = cp.execSync(`$(npm bin)/functions logs read --start-time ${startTime}`).toString();
    });

    it('should return correct books when send a search request', async () => {
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
      logger.info(data);
      expect(data.total).toBeInstanceOf(Number);
    });
  });
});
