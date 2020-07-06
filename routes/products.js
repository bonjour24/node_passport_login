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

router.post('/add',(req,res)=>{
    const {cat , name ,price , image} = req.body;
    Products.findOne({name:name}).then(prod=>{
        if(prod)
            console.log("Chal be");
        else{
            const newProd = new Products({
                cat,
                name,
                price,
                image,
                vendor:'5ef9c1c5da5f87140cbef2d6'
            });
            newProd.save(function (err) {
                if (err) return console.log(err);
                else console.log('Done!')
              });
        };
    });
});

console.log("Go learn Express.js");

module.exports = router;