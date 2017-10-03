const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: String,
  dob: Date, // date of birth
  nric: { type: String, unique: true }, // NRIC/FIN
  membershipId: Number,
  membershipExpiry: Date,
  otherId: String,
  remarks: String,
  otherFields: [{
    label: String,
    value: String
  }]
}, { timestamps: true });

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;
