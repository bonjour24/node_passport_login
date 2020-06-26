const mongoose=require('mongoose');

var ProductSchema = new mongoose.Schema({
    category:String,
    name: String,
    price: Number,
    image: String
});

const Products = mongoose.model('Products', ProductSchema);;

module.exports = Products;
