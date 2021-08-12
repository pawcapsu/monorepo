module.exports = {
  apps: [{
    name: "pawcapsu-api",
    script: "./dist/main.js",
    env: {
      MODE: "PRODUCTION",
    },
  }]
}