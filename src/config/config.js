module.exports = {
  server: {
    port: 3000,
  },
  rpc: {
    protocol: "http",
    host: "127.0.0.1",
    user: "rpcusr",
    password: "rpcpass",
    // port: 8332, --bitcoind
    port: 38332, // -signet
  },
  indexCfg: {
    monitorSleepTimeMS: 60000,
    initialStatus: false,
  },
};
