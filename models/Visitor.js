const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');
const softDelete = require('mongoose-delete');
const dataTable = require('mongoose-datatable');

mongoose.plugin(dataTable.init);

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
  }],
  deleted: { type: Boolean, default: false },
  deletedAt: Date,
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor' }
}, { timestamps: true });

visitorSchema.plugin(paginate);
visitorSchema.plugin(softDelete, { deletedAt: true, deletedBy: true });

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;
