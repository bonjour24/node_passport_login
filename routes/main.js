"use strict";
const router = require('express').Router();
const User = require('../models/User');
const Product = require('../models/products');
const Cart = require('../models/cart');
const async = require('async');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const stripe=require('stripe')('sk_test_51H1q12FeEKfkFHBeoMqwI5LJqs64gLOscn7YLRyrEuVxBxhWjCaaDYiqxGKQSqeTs3ps7hMgLQtUEFI8GMUSE5Y600Rhn3Ml9T');

router.post('/payment',ensureAuthenticated, function(req, res, next) {
    var stripeToken = req.body.stripeToken;
    const desc=req.body.desc;
    var currentCharges = Math.round(req.body.stripeMoney * 100);
    stripe.customers.create({
      email:req.body.stripeEmail,
      source: stripeToken,
    }).then(customer=>stripe.charges.create({
      amount:currentCharges,
      currency:'inr',
      customer:customer.id,
      description:'Payment'
    }))
    .catch((err)=>{
      console.log(err);
    })
    // .then(function(charge) {
    //   async.waterfall([
    //     function(callback) {
    //       Cart.findOne({ owner: req.user._id }, function(err, cart) {
    //         callback(err, cart);
    //       });
    //     },
    //     function(cart, callback) {
    //       User.findOne({ _id: req.user._id }, function(err, user) {
    //         if (user) {
    //           for (var i = 0; i < cart.items.length; i++) {
    //             user.history.push({
    //               item: cart.items[i].item,
    //               paid: cart.items[i].price
    //             });
    //           }
  
    //           user.save(function(err, user) {
    //             if (err) return next(err);
    //             callback(err, user);
    //           });
    //         }
    //       });
    //     },
    //     function(user) {
    //       Cart.update({ owner: req.user._id }, { $set: { items: [], total: 0 }}, function(err, updated) {
    //         if (updated) {
    //           res.redirect('/home');
    //         }
    //       });
    //     }
    //   ]);
    // });
  });

module.exports = router;