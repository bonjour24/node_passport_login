const express = require('express');
const router = express.Router();
const categ = require('../models/category');

let cat= new categ();
cat.name = 'Gifts';
cat.save((err)=>{
    if(err) console.log(err);
    else console.log("Added Category :" + cat.name);
});                    
       
module.exports = router;
