module.exports = () => {
  return {
    region: process.env.REGION || 'us-central1',
    runtime: process.env.RUNTIME || 'nodejs'
  };
};
