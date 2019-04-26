const mongoClient = require('mongodb');
const assert = require('chai').assert;

let _db;

const connectDb = (cb) => {
  mongoClient.connect(process.env.DB, (err, db) => {
    if (err) {
      return cb(err);
    }
    
    _db = db;
    cb(null);
  })
}

const getDb = () => {
  assert.isOk(_db);
  return _db;
}

module.exports = {
  connectDb,
  getDb
}
