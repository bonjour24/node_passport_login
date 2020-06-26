const express = require('express');
const router = express.Router();
const Products = require ('../models/products');
const { route } = require('./users');

router.get('/display',async (req,res)=>{
    const prods= await Products.find({});
    res.render('prod',{prods});
    console.log(prods)
});

router.get('/add',(req,res)=>{
    res.render('addProd');
});

router.post('/prod/add',(req,res)=>{
    const {cat , name ,price} = req.body;
    Products.findOne({name:name}).then(prod=>{
        if(prod)
            console.log("Chal be");
        else{
            const newProd = new Products({
                cat,
                name,
                price
            });
            newProd.save(function (err) {
                if (err) return console.log(err);
                else console.log('Done!')
              });
        }
    })
})
 

console.log("Go learn Express.js");

module.exports = router;