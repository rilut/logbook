const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');

const logSchema = new mongoose.Schema({
  visitor: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor' },
  timeIn: { type: Date, default: Date.now }, // loginTime
  timeOut: Date, // logoutTime
  loginSuccessful: Boolean
}, { timestamps: true });

logSchema.plugin(paginate);

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
