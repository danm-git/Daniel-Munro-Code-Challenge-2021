const rpc = require("../src/op_return/rpc");
const indexer = require("../src/op_return/indexer");
const dbConfig = require("../src/config/db.config");
const db = require("../src/op_return/db");
const utils = require("../src/op_return/utils");

// TODO - Test cases need to be built out a lot more

test("Run getBlockHeight", () => {
  const blockHeight = rpc.getBlockHeight();
  expect(blockHeight).toBeDefined();
});

test("Run getPruneHeight", () => {
  const pruneHeight = rpc.getPruneHeight();
  expect(pruneHeight).toBeDefined();
});

test("Run getBlockHash", () => {
  const blockHash = rpc.getBlockHash(1);
  expect(blockHash).toBeDefined();
});

test("Run getStopIndex", () => {
  expect(indexer.stopIndex()).toBe(false);
});

test("Run isIndexRunning", () => {
  expect(indexer.isIndexRunning()).toBe("false");
});

test("Run extractOpData", () => {
  expect(utils.extractOpData("¶�◄<�Rh6y�>v�o����ou☺")).toBeDefined();
});

// test("Run getBlock", () => {
//   try {
//     const block = rpc.getBlock(
//       "279a25ece0664d3bd40d0a39f802e810d9f6e2624ff47ebe934eedd9fdcf1243"
//     );
//     expect(block).toBeDefined();
//   } catch {
//     expect(block).toBeUnDefined();
//   }
// });
