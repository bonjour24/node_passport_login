const mongoose=require('mongoose');
const { schema } = require('./category');
const Schema = mongoose.Schema;
var mongoosastic = require('mongoosastic');


var ProductSchema = new mongoose.Schema({
    category:{type: Schema.Types.ObjectId, ref: 'Category'},
    name: String,
    price: Number,
    image: String,
    vendor:{type: Schema.Types.ObjectId, ref:'Vendor'}
});



const Products = mongoose.model('Products', ProductSchema);;

module.exports = Products;
