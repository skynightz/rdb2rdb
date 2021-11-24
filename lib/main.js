const r = require("rethinkdb");
const watt = require("watt");
const batchSize = 1000;

/*************************** Helper functions ***************************/

const ensureDbExist = watt(function* (conn, next) {
  let q = r.dbList();
  const dbList = yield q.run(conn, next);
  if (dbList.indexOf(conn.db) === -1) {
    console.log(`Destination db "${conn.db}" doesn't exist !`);
    q = r.dbCreate(conn.db);
    yield q.run(conn, next);
    console.log(`Destination db "${conn.db}" created.`);
  }
});

const getTableList = watt(function* (conn, next) {
  q = r.tableList();
  return yield q.run(conn, next);
});

// Create table or clean records of a table
const createOrCleanTable = watt(function* (tableList, table, conn, next) {
  if (tableList.indexOf(table) === -1) {
    // Create table if it doesn't exist
    q = r.tableCreate(table);
    yield q.run(conn, next);
    console.log(`Created table "${table}" in destination db`);
  } else {
    // Clear all records of the table
    q = r.table(table).delete();
    yield q.run(conn, next);
    console.log(`Cleared table "${table}" in destination db`);
  }
});

/************************************************************************/

module.exports = watt(function* (sourceDatabase, destinationDatabase, next) {
  console.log("Connecting source db and destination db...");
  const connSDB = yield r.connect(sourceDatabase, next);
  const connDDB = yield r.connect(destinationDatabase, next);
  console.log("Source db and destination db connected !");

  // Ensure destination db exist
  yield ensureDbExist(connDDB, next);

  // Get table list
  const srcTableList = yield getTableList(connSDB, next);
  const dstTableList = yield getTableList(connDDB, next);

  // Number of tables copied
  let i = 0;

  // Insert rows
  for (let table of srcTableList) {
    let rowsInserted = 0;
    yield createOrCleanTable(dstTableList, table, connDDB, next);
    console.log(`Start copying table "${table}"...`);
    q = r.table(table);
    let cursor = yield q.run(connSDB, next);
    let records = [];
    let err;
    // Batch 1000 records by 1000 records
    do {
      try {
        const record = yield cursor.next(next);
        records.push(record);
        if (records.length === batchSize) {
          const q = r.table(table).insert(records);
          const res = yield q.run(connDDB, next);
          rowsInserted += res.inserted;
          records = [];
        }
      } catch (e) {
        err = e;
        if (e.msg == "No more rows in the cursor.") {
          if (records.length > 0) {
            const q = r.table(table).insert(records);
            const res = yield q.run(connDDB, next);
            rowsInserted += res.inserted;
          }
        } else {
          throw e;
        }
      }
    } while (!err);
    i++;
    console.log(
      `Copy of table "${table}" finished | number of rows inserted: ${rowsInserted} | table ${i}/${srcTableList.length}`
    );
  }

  console.log(
    "All tables have been copied ! Disconnecting from source db and destination db..."
  );

  connSDB.removeAllListeners();
  connDDB.removeAllListeners();
  yield connSDB.close({ noreplyWait: true }, next);
  yield connDDB.close({ noreplyWait: true }, next);

  console.log("Disconnected !");
});
