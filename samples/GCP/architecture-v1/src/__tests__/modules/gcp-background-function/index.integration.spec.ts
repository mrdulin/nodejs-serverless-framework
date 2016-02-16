import cp from 'child_process';
import path from 'path';

import { FunctionEmulator } from '../../../util';

const localPath = path.resolve(process.cwd(), './src/modules/gcp-background-function');
const functionName = 'bk';
const topicName = 'my-topic';
const fnEmulator = new FunctionEmulator({ functionName });

beforeAll(() => {
  console.log(
    cp
      .execSync(`cd ${localPath} && functions start && functions deploy ${functionName} --trigger-topic=${topicName}`)
      .toString()
  );
});

afterAll(() => {
  fnEmulator.stop();
});

describe('gcp-background-function integration test suites', () => {
  beforeEach(() => {
    fnEmulator.clearLogs();
  });

  it('t-1', () => {
    const name = Math.random();
    const data = fnEmulator.buildEventData(name);
    fnEmulator.call(data);
    const logs = fnEmulator.readLogs();
    expect(logs).toContain(`Hello, ${name}!`);
  });
});
