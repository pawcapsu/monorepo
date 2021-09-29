module.exports = {
  apps: [{
    name: "pawcapsu-api",
    script: "./apps/pawcapsu-api/main.js",
    env: {
      MODE: "PRODUCTION",
    },
  }]
}