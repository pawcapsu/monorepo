module.exports = {
  apps: [{
    name: "notifier-api",
    script: "./apps/notifier/main.js",
    env: {
      MODE: "PRODUCTION",
    },
  }]
}