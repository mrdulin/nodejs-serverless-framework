import cp from 'child_process';

function deploy(localPath: string, functionName: string) {
  console.log(cp.execSync(`cd ${localPath}; functions deploy ${functionName} --trigger-http`).toString());
}

function clearLogs() {
  try {
    console.log('clear logs');
    cp.execSync('functions logs clear');
  } catch (err) {
    console.error(err);
  }
}

export { deploy, clearLogs };
