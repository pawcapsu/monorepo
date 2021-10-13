module.exports = {
  apps: [{
    name: "archive-api",
    script: "./dist/main.js",
    env: {
      MODE: "PRODUCTION",
    },
  }]
}