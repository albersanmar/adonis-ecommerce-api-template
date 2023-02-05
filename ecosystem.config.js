module.exports = {
  apps: [
    {
      name: 'liveranch',
      script: './build/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}
