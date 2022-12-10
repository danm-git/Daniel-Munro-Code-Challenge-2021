const { timesSeries } = require("async");
const { mapSeries } = require("async");
const _ = require("lodash/fp");
const utils = require("./utils");
const db = require("./db");
const rpc = require("./rpc");
const { indexCfg } = require("../config/config");

let indexIsRunning = indexCfg.initialStatus;

//////////
// MAIN //
//////////
const startIndexer = async () => {
  if (indexIsRunning == true) {
    console.log("Indexer is already running...");
    return;
  } else {
    indexIsRunning = true;
  }

  console.log("INDEXER IS NOW STARTING");

  return Promise.all([
    db.getLastIndexedBlock(),
    rpc.getPruneHeight(),
    rpc.getBlockHeight(),
  ])
    .then(([lastIndexedHeight, pruneHeight, blockHeight]) => {
      console.log("lastIndexedHeight=" + lastIndexedHeight);
      console.log("pruneHeight=" + pruneHeight);
      console.log("blockHeight=" + blockHeight);

      const startBlock =
        pruneHeight > lastIndexedHeight
          ? pruneHeight
          : parseInt(lastIndexedHeight) + 1;

      console.log("startBlock=" + startBlock);

      if (startBlock >= blockHeight) {
        console.log("You are all caught up!");
        return null;
      }

      return indexBlocks(startBlock, blockHeight);
    })
    .catch(function (err) {
      console.log("startIndexer Promise Rejected:" + err);
    })
    .then(() => {
      setTimeout(() => {
        if (indexIsRunning) {
          console.log("Checking for new records to index...");
          indexIsRunning = false;
          startIndexer();
        } else {
          console.log(
            "INDEXER IS NOW STOPPED.  Please use the admin page to Start again."
          );
          return;
        }
      }, indexCfg.monitorSleepTimeMS);
    });
};

const stopIndex = () => {
  console.log("Stopping the indexer.  This may take a minute...");
  indexIsRunning = false;

  return indexIsRunning;
};

const isIndexRunning = () => {
  console.log("isIndexRunning:" + JSON.stringify(indexIsRunning));
  return JSON.stringify(indexIsRunning);
};

/*///////////////
  BLOCK INDEXING
///////////////*/
const indexBlocks = async (startBlock, endBlock) => {
  if (
    startBlock === null ||
    endBlock === null ||
    startBlock === undefined ||
    endBlock === undefined
  ) {
    console.log(
      "Bad input Data - endBlock=" + endBlock + " - startBlock=" + startBlock
    );
    return;
  }

  const numBlocks = parseInt(endBlock) - parseInt(startBlock);

  return new Promise((resolve, reject) => {
    // Loop through blocks
    timesSeries(
      numBlocks,
      (index, next) => {
        if (indexIsRunning) {
          const nextBlock = startBlock + index;
          // Process a single block
          indexBlock(nextBlock).then(() => {
            setTimeout(() => next(), 100);
          });
        } else {
          console.log("Index Blocks is now stopping...");
          resolve();
        }
      },
      (res) => {
        resolve();
      }
    );
  }).catch(function (err) {
    console.log("indexBlocks Promise Rejected.:" + err);
    reject(err);
  });
};

const indexBlock = (blockHeight) => {
  // First we look up the hash
  // Then get block info using that hash
  return rpc
    .getBlockHash(blockHeight)
    .then((hash) => {
      rpc.getBlock(hash).then((result) => {
        indexTxs(result.tx, result.hash, blockHeight);
      });
    })
    .catch(function (err) {
      console.log("indexBlock Rejected:" + err);
      reject(err);
    });
};

/*///////////////
  TXN INDEXING
///////////////*/
const indexTxs = (txs, blockHash, blockHeight) => {
  var cnt = 0;

  return new Promise(
    (resolve, reject) => {
      mapSeries(txs, (tx, next) => {
        if (cnt++ >= 1) {
          return;
        }

        extractSaveTxnData(tx, blockHash, blockHeight).then(next());
      }).catch((err) => {
        console.log("Failed indexing tx:" + err);
      });
    },
    (err) => {
      console.log("indexTxs err:" + err);
      return reject(err);
    }
  );
};

const extractSaveTxnData = (tx, blockHash, blockHeight) => {
  return new Promise((resolve, reject) => {
    // Extract Data
    const meta = extractOpMeta(tx);
    mapSeries(
      meta,
      (opcode, next) => {
        //Save record to DB
        // console.log("saveOpMeta here...");
        // console.log("opcode=" + opcode.toString("hex"));
        // console.log("tx.txid=" + tx.txid);
        // console.log("blockHash=" + blockHash);
        // console.log("blockHeight=" + blockHeight);

        db.insertOpRecord(
          opcode.toString("hex").replace("/^0+/", ""),
          tx.txid,
          blockHash,
          blockHeight
        ).then(next());
      },
      (err, all) => {
        resolve(all);
      }
    );
  });
};

/**
 * Source: https://github.com/goga-m/btc-opreturn
 **/
const extractOpMeta = (tx) => {
  const scriptPubKeys = _.map("scriptPubKey", tx.vout);

  const meta = _.map((out) => {
    const script = Buffer.from(out.hex, "hex");

    return utils.extractOpData(script);
  }, scriptPubKeys);

  return _.compact(meta);
};

module.exports = {
  startIndexer,
  indexTxs,
  isIndexRunning,
  stopIndex,
};
