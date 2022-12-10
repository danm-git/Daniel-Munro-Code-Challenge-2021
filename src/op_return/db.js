const dbConfig = require("../config/db.config");
const queries = require("./queries");
const _ = require("lodash/fp");

const formatOpResponse = (row) => {
  return {
    txhash: row.txhash,
    blockhash: row.blockhash,
    op_return: Buffer.from(row.op_return, "hex").toString("utf8"),
  };
};

const getOpReturnData = (req, res) => {
  const recordId = req.params.opReturnData;
  console.log(`GET /opreturn/${recordId}`);

  dbConfig.query(
    queries.getOpReturnDataSql,
    [recordId.toString("hex")],
    (error, results) => {
      if (error) throw error;
      res.status(200).json(_.map(formatOpResponse, results.rows));
    }
  );
};

const getRecordCount = (req, res) => {
  dbConfig.query(queries.getRecordCountSql, [], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows[0].count);
  });
};

const getLastRecordDate = (req, res) => {
  dbConfig.query(queries.getLastRecordDateSql, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows[0].max);
  });
};

const getLastIndexedBlock = () => {
  return new Promise((resolve, reject) => {
    dbConfig.query(queries.getLastIndexedBlockSql, (error, results) => {
      if (error) reject(error);
      resolve(
        JSON.stringify(
          null != results && results.rowCount > 0
            ? null == results.rows[0].max
              ? 1
              : results.rows[0].max
            : 1
        )
      );
    });
  });
};

const insertOpRecord = (opReturn, txHash, blockHash, blockHeight) => {
  console.log("insertOpRecord-" + opReturn);
  return new Promise((resolve, reject) => {
    dbConfig.query(
      queries.insertOpRecordSql,
      [opReturn, txHash, blockHash, blockHeight],
      (error, results) => {
        if (error) reject(error);
        resolve(JSON.stringify(results));
      }
    );
  });
};

module.exports = {
  getOpReturnData,
  getLastIndexedBlock,
  insertOpRecord,
  getRecordCount,
  getLastRecordDate,
};
