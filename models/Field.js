const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  label: String
}, { timestamps: true });


const Field = mongoose.model('Field', fieldSchema);

module.exports = Field;
