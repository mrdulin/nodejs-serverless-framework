import cp from 'child_process';

interface IFunctionEmulatorOpts {
  functionName: string;
}
class FunctionEmulator {
  public functionName: string = '';
  constructor(opts: IFunctionEmulatorOpts) {
    this.functionName = opts.functionName;
  }
  public call(data: any, envVars?: { [key: string]: string }) {
    let json: string = data;
    if (typeof data !== 'string') {
      json = JSON.stringify(data);
    }
    const options = {
      env: {
        ...process.env,
        ...envVars
      }
    };
    cp.execSync(`functions call ${this.functionName} --data '${json}'`, options);
  }

  public buildEventData(message: any): string {
    const encodedMessage = Buffer.from(JSON.stringify(message)).toString(`base64`);
    return JSON.stringify({ data: encodedMessage });
  }

  public readLogs(): string {
    return cp.execSync(`functions logs read ${this.functionName}`).toString();
  }

  public clearLogs(): void {
    cp.execSync('functions logs clear');
  }

  public stop() {
    cp.execSync('functions stop');
  }

  public start() {
    cp.execSync('functions start');
  }

  public getBaseEndpoint(): string {
    const configJSON: string = cp.execSync('functions config list --json').toString();
    const config = JSON.parse(configJSON);
    const baseUrl = `http://${config.host}:${config.supervisorPort}/${config.projectId}/${config.region}`;
    return baseUrl;
  }
}

export { FunctionEmulator };
