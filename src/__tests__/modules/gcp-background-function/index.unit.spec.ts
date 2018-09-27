import { bk } from '../../../modules/gcp-background-function';

console.log = jest.fn();

describe('gcp-background-function unit test suites', () => {
  it('t1', () => {
    const name = Math.random().toString();
    const event = {
      data: {
        data: Buffer.from(name).toString(`base64`)
      }
    };

    bk(event, () => {
      expect(console.log).toBeCalledWith(`Hello, ${name}!`);
    });
  });

  it('t2', () => {
    const event = {
      data: {}
    };

    bk(event, () => {
      expect(console.log).toBeCalledWith(`Hello, World!`);
    });
  });
});
