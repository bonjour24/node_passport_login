const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema Definition
const UserSchema = new mongoose.Schema({
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
  address:String,
  history:[{
    paid: { type: Number, default: 0},
    item: { type: Schema.Types.ObjectId, ref: 'Product'}
  }]
});

//Setup
const User = mongoose.model('User', UserSchema);

//Export
module.exports = User;
