const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));


// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('signup'));

// Register (Post)
router.post('/register', (req, res) => {
  const { name, email, password, phone } = req.body;
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
    User.findOne({ email: email }).then(user => {
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
                res.redirect('/users/login');
              })
              .then(user=>{
                  var cart = new Cart();
                  cart.owner = user._id;
                  cart.save(function(err) {
                    if (err) return next(err);
                    req.logIn(user, function(err) {
                      if (err) return next(err);
                      res.redirect('/profile');
                    })
                })
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


// Login Post
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
