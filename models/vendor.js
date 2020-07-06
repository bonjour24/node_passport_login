const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema Definition
const VendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone:{
    type: Number,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  products:[{type:Schema.Types.ObjectId, ref:'Products'}]
});

//Setup
const Vendor = mongoose.model('Vendor', VendorSchema);

//Export
module.exports = Vendor;