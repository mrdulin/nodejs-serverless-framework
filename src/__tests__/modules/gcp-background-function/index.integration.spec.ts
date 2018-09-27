import cp from 'child_process';
import path from 'path';

import { FunctionEmulator } from '../../../util';

const localPath = path.resolve(process.cwd(), './src/modules/gcp-background-function');
const functionName = 'bk';
const topicName = 'my-topic';
const fnEmulator = new FunctionEmulator({ functionName });

beforeAll(() => {
  console.log(cp.execSync(`cd ${localPath}; functions deploy ${functionName} --trigger-topic=${topicName}`).toString());
});

describe('gcp-background-function integration test suites', () => {
  beforeEach(() => {
    fnEmulator.clearLogs();
  });
  it('t-1', () => {
    fnEmulator.call({ data: Math.random() });
    const logs = fnEmulator.readLogs();
    expect(logs).toContain(`Hello, ${name}!`);
  });
});
