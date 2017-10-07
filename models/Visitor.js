const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');
const softDelete = require('mongoose-delete');

const visitorSchema = new mongoose.Schema({
  name: String,
  dob: Date, // date of birth
  nric: { type: String, unique: true }, // NRIC/FIN
  membershipId: String,
  membershipExpiry: Date,
  otherId: String,
  remarks: String,
  otherFields: [{
    label: String,
    value: String
  }]
}, { timestamps: true });

visitorSchema.plugin(paginate);
visitorSchema.plugin(softDelete, { deletedAt: true, deletedBy: true });

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;
