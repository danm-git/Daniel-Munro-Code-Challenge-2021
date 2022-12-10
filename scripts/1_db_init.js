const dbConfig = require("../src/config/db.config");
const queries = require("../src/op_return/queries");

console.log("Create DB..." + queries.createOpDbSql);

// dbConfig.query(queries.createOpDbSql, (error, results) => {
//   if (error) {
//     console.log(error);
//     throw error;
//   }
//   console.log("DB Created.");
// });

console.log("Creating OP Table...");
dbConfig.query(queries.createOpTableSql, (error, results) => {
  if (error) {
    console.log(error);
    throw error;
  }
  console.log("OP Table Created.");
  return results;
});
