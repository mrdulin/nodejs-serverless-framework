import cp from 'child_process';

function deploy(localPath: string, functionName: string) {
  console.log(cp.execSync(`cd ${localPath}; functions deploy ${functionName} --trigger-http`).toString());
}

function clearLogs() {
  console.log(cp.execSync('functions logs clear').toString());
}

export { deploy, clearLogs };
