module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: "poketest"
    },
    binary: {
      version: "4.0.3",
      skipMD5: true
    },
    autoStart: false
  }
};
