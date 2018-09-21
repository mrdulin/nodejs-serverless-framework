functionName=searchBook

echo 'compile ts to js'
../../../node_modules/.bin/tsc

echo 'deploy cloud function'
../../../node_modules/.bin/functions deploy ${functionName} --trigger-http
