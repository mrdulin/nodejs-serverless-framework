module.exports = () => {
  return {
    projectId: process.env.PROJECT_ID || 'my-project',
    region: process.env.REGION || 'us-central1',
    runtime: process.env.RUNTIME || 'nodejs',
    credentials: process.env.CREDENTIALS || ''
  };
};
