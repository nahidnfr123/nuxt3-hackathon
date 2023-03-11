module.exports = {
  apps: [
    {
      name: 'Nuxt3Hackathon',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
