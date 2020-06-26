const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('home'));

// Dashboard
router.get('/home', ensureAuthenticated, (req, res) =>
  res.render('home', {
    user: req.user,
    title:'Home'
  })
);

router.get('/gifts',ensureAuthenticated,(req,res)=>{
  res.render('gifts',{user:req.user, title:'Gifts'})
})

module.exports = router;
