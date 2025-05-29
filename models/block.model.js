const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  log: Object,
  previousHash: String,
  hash: String,
});

const Block = mongoose.model('Block', blockSchema);
module.exports = Block;
