"use strict";
const express=require('express');
const router=express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//Load Vendor Model
const Vendor=require('../models/vendor');
//Authentication
const { forwardAuthenticated } = require('../config/vendorAuth');
const Products = require('../models/products');

//Regitser Page
router.get('/register',(req,res)=>{
    res.render('vendor/signup');
});

//Register Post
router.post('/register', (req, res) => {
    const { name, email, password, phone  } = req.body;
    let errors = [];

    if (!name || !email || !password || !phone) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('signup', {
        errors,
        name,
        email,
        password,
        phone
        });
    } else {
        Vendor.findOne({ email: email }).then(user => {
    if (user) {
        errors.push({ msg: 'Email already exists' });
        console.log(errors)
        res.render('signup', {
        errors,
        name,
        email,
        password,
        phone,
        title:'Sign Up'
        });
    } else {
        console.log("Done")
        const newUser = new User({
        name,
        email,
        password,
        phone
        });

        bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
            .save()
            .then(user => {
                req.flash(
                'success_msg',
                'You are now registered and can log in'
                );
                res.redirect('/vendor/login');
            })
        });
        });
    }
    });
}
});

//Login 
router.get('/login',(req, res) => {
    res.render('vendor/vendorLogin');
});

  // Login (Post)
router.post('/login', (req, res, next) => {
    const { email , password } = req.body;
    Vendor.findOne({email:email})
        .then(found=>{
            if(!found){
                res.redirect('/vendor/login');
            }
            else{
                bcrypt.compare(password,found.password,(err,isMatch)=>{
                    if(err) throw err;
                    if (isMatch) {
                        console.log('match')
                      } else {
                          console.log('Not a match')
                      }
                })
            }
            Products.find({vendor:found._id},(err,prods)=>{
                if(err) console.log('No vendor Prods')
                else{
                    console.log(prods);
                    res.render('vendor/list',{user:found,prods,id:found._id});
                }
            })
        })
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/vendor/home');
});

router.get('/add/:vendor_id',(req,res)=>{
    res.render('vendor/addProd',{id:req.paramsvendor_id});
});

router.post('/add/:vendor_id',(req,res)=>{
    const { name, category ,price ,image} =req.body;
    Products.findOne({name:name},(err,prod)=>{
        if(err) console.log(err);
        else if(prod) console.log('Already exists');
        else{
            const newProd= new Products({
                category,
                name,
                price,
                image,
                vendor:req.params.vendor_id,
            })
            newProd.save()
            .then(()=>{
                res.redirect('/vendor/add/:vendor_id')
            })
        }
    })
})

module.exports=router;
