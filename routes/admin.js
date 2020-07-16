const express = require('express');
const router = express.Router();
const categ = require('../models/category');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Category = require('../models/category');
// Load User model(Admin)
const User = require('../models/User');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');
const Products = require('../models/products');
const Vendor = require('../models/vendor');

router.get('/login', forwardAuthenticated, (req, res) => res.render('admin/login'));

router.post('/login', (req, res, next) => {
    if(req.body.email=='admin@enr'){
        console.log('Maths Rocks')
        passport.authenticate('local', {
            successRedirect: '/admin/home',
            failureRedirect: '/admin/login',
            failureFlash: true
          })(req, res, next);
    }
    else console.log('Maths Sucks');
});

router.get('/home', ensureAuthenticated, (req,res)=>{
    res.render('admin/home',{user:req.user});
});

router.get('/prods',ensureAuthenticated,(req,res)=>{
    Products.find({},(err,prods)=>{
        if(err) console.log(err);
        res.render('admin/products',{prods,user:req.user});
    });
})

router.get('/remove/:product_id',ensureAuthenticated,(req,res)=>{
    const toRemove=req.params.product_id;
    Products.deleteOne({_id:toRemove},(err,prod)=>{
        res.redirect('/admin/prods');
    })
})

router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('admin/addProd');
});

router.post('/add',ensureAuthenticated,(req,res)=>{
    const { name, category ,price ,image} =req.body;
    const cat=Category.findOne({name:category},(err,found)=>{
        Products.findOne({name:name},(err,prod)=>{
            if(err) console.log(err);
            else if(prod) console.log('Already exists');
            else{
                const newProd= new Products({
                    category:found._id,
                    name,
                    price,
                    image,
                })
                newProd.save()
                .then(()=>{
                    res.redirect('/admin/prods')
                })
            }
        })
    });
})

router.get('/sellers',ensureAuthenticated,(req,res)=>{
    Vendor.find({},(err,vendors)=>{
        res.render('admin/vendors',{list:vendors});
    })
})

router.get('/category',ensureAuthenticated,(req,res)=>{
    Category.find({},(err,list)=>{
        if(err) console.log(err);
        else{
            res.render('admin/category',{user:req.user,list});
        }
    });
});

router.post('/addcat',ensureAuthenticated,(req,res)=>{
    const categ=req.body.name;
    Category.findOne({name:categ},(err,found)=>{
        if(err) console.log(err);
        else if(found)  console.log('Category Already exists');
        else{
            const cat= new Category({
                name:categ,
            })
            cat.save()
            .then(()=>{
                res.redirect('/admin/home');
            })
        }
    })
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/admin/login');
  });
module.exports = router;
