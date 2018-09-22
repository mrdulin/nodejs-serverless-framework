import cp from 'child_process';
import path from 'path';

import { clearLogs } from '../../util';

jest.setTimeout(30000);

const localPath = path.resolve(process.cwd(), './src/modules/gcp-background-function');
const functionName = 'bk';
const topicName = 'my-topic';
beforeAll(() => {
  console.log(cp.execSync(`cd ${localPath}; functions deploy ${functionName} --trigger-topic=${topicName}`).toString());
});

describe('gcp-background-function integration test suites', () => {
  beforeEach(() => {
    clearLogs();
  });
  it('t-1', () => {
    const name = Math.random().toString();
    const encodedName = Buffer.from(name).toString(`base64`);
    const data = JSON.stringify({ data: encodedName });
    cp.execSync(`functions call ${functionName} --data '${data}'`);
    const logs = cp.execSync(`functions logs read ${functionName}`).toString();
    expect(logs).toContain(`Hello, ${name}!`);
  });
});
