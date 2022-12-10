const createOpDbSql = "CREATE DATABASE opreturns;";
const createOpTableSql =
  'CREATE TABLE IF NOT EXISTS "op_returns" ("id" SERIAL PRIMARY KEY, "op_return" bytea NOT NULL, "txhash" text NOT NULL, "blockhash" text NOT NULL, "blockheight" integer NOT NULL, "index_date" DATE);';

const getAllOpReturnsSql = 'SELECT * FROM "op_returns"';
const getOpReturnByIdSql = 'SELECT * FROM "op_returns" WHERE id = $1 ';
const insertOpRecordSql =
  'INSERT INTO "op_returns" (op_return ,txhash, blockhash, blockheight, index_date) VALUES ( $1 , $2, $3, $4, CURRENT_TIMESTAMP) ON CONFLICT DO NOTHING; ';
const getOpReturnDataSql = 'SELECT * FROM "op_returns" WHERE op_return = $1 ;';
const getLastIndexedBlockSql = 'SELECT MAX(blockheight) FROM "op_returns";';
const getRecordCountSql = 'SELECT COUNT(blockheight) FROM "op_returns";';
const getLastRecordDateSql = 'SELECT MAX(index_date) FROM "op_returns";';

module.exports = {
  getAllOpReturnsSql,
  getOpReturnByIdSql,
  insertOpRecordSql,
  getOpReturnDataSql,
  getLastIndexedBlockSql,
  getRecordCountSql,
  getLastRecordDateSql,
  createOpDbSql,
  createOpTableSql,
};
