const { rpc } = require("../config/config");
const RpcClient = require("node-json-rpc2").Client;
var client = new RpcClient(rpc);

const getBlockHeight = () => {
  const method = "getblockchaininfo";
  const params = [];
  return new Promise((resolve, reject) => {
    client.call({ method, params }, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }

      resolve(null != res.result ? res.result.blocks : 0);
    });
  }).catch(function () {
    console.log("Get Block height Promise Rejected. So sorry about this.");
  });
};

const getPruneHeight = () => {
  const method = "getblockchaininfo";
  const params = [];

  return new Promise((resolve, reject) => {
    client.call({ method, params }, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(null != res.result ? res.result.pruneheight : 0);
    });
  }).catch(function () {
    console.log("Get Prune height Promise Rejected. So sorry about this.");
  });
};

const getBlockHash = (blockHeight) => {
  const method = "getblockhash";
  const params = [blockHeight];

  return new Promise((resolve, reject) => {
    client.call({ method, params }, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(null != res ? res.result : res);
    });
  }).catch(function (err) {
    console.log("getBlockHash Promise Rejected. So sorry about this." + err);
  });
};

const getBlock = (hash) => {
  const method = "getblock";
  const params = [hash, 2];

  // Call getblock
  return new Promise((resolve, reject) => {
    client.call({ method, params }, (err, res) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(res.result);
    });
  }).catch(function (err) {
    console.log("getBlock Promise Rejected. So sorry about this." + err);
  });
};

module.exports = {
  getBlockHeight,
  getPruneHeight,
  getBlockHash,
  getBlock,
};
