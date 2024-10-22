module.exports = {
  apps: [
    {
      name: 'nestjs-app',
      script: './dist/main.js',
      args: './src/main.ts',
      instances: 1,
      watch: true,
<<<<<<< HEAD
 ignore_watch: [
=======
      ignore_watch: [
>>>>>>> a8b88b4cfe48527302a586ec0a464186de5a213f
        'uploads', // Ignore changes in the "uploads" directory or route
      ],

      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
