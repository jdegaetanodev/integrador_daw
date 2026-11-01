module.exports = {
  apps: [
    {
      name: 'clinica-backend',
      script: 'dist/main.js',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
