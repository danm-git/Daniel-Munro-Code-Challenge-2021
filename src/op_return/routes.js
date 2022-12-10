const { Router } = require("express");
const db = require("./db");
const indexer = require("./indexer");
const rpc = require("./rpc");
const router = Router();

router.get("/startIndex", indexer.startIndexer);
router.get("/stopIndex", indexer.stopIndex);
router.get("/lastIndex", db.getLastIndexedBlock);
router.get("/pruneHeight", rpc.getPruneHeight);
router.get("/indexStatus", indexer.isIndexRunning);
router.get("/recordCount", db.getRecordCount);
router.get("/lastRecordDate", db.getLastRecordDate);

router.get("/:opReturnData", db.getOpReturnData);

module.exports = router;
