const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load Vendor model
const Vendor = require('../models/vendor');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match Vendor
      Vendor.findOne({
        email: email
      }).then(vendor => {
        if (!vendor) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, vendor.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, vendor);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(vendor, done) {
    done(null, vendor.id);
  });

  passport.deserializeUser(function(id, done) {
    Vendor.findById(id, function(err, vendor) {
      done(err, vendor);
    });
  });
};


