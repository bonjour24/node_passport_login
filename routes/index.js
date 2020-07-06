const express = require('express');
const router = express.Router();
const Products = require('../models/products');
const Cart =  require('../models/cart');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const cart = require('../models/cart');

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

router.get('/flowers',ensureAuthenticated,(req,res)=>{
  res.render('flowers',{user:req.user, title:'Gifts'})
})

router.get('/cart', ensureAuthenticated,async function(req, res, next) {
  Cart
    .findOne({ owner: req.user._id })
    .exec(function(err, foundCart) {
      if (err) return next(err);
      res.render('cart', {
        user:req.user,
        itemy:foundCart.items,
        foundCart: foundCart,
      });
    });
});

router.get('/products',ensureAuthenticated, async (req,res)=>{
  const prods= await Products.find({});
  const id= req.user._id;
  res.render('prod',{prods, user:req.user});
});

router.get('/profile',ensureAuthenticated, (req,res)=>{
  const id=req.user._id;
  const {name,email,phone,history}=req.user;
  const last=history[0];
  res.render('profile',{name,email,phone,last,history,user:req.user})
})

router.post('/products/:product_id',ensureAuthenticated,(req,res)=>{
  Cart.findOne({ owner: req.user._id }, function(err, cart) {
    let index=-1;
    for(let i=0;i<cart.items.length;i++){
      if(cart.items[i].item==req.body.product_id){
       index=i;
       break;
      }
    }
    if(index!=-1){
      cart.items[index].quantity+=1;
      cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);
   }
   else{
    cart.items.push({
      item: req.body.product_id,
      price: parseFloat(req.body.priceValue),
      quantity: parseInt(1),
      name:req.body.name
    });

    cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);
  }
      cart.save(function(err) {
      if (err) console.log (err);
      return res.redirect('/cart');
    });
  });
})

router.get('/viewprod/:product_id',ensureAuthenticated,(req,res)=>{
  const prod=req.params.product_id;
  Products.findOne({_id:prod},(err,prodFound)=>{
    res.render('singleProd',{prodFound})
  })
})

router.get('/cart/delete/:product_id',ensureAuthenticated, function(req, res,next) {
  Cart.findOne({ owner: req.user._id }, function(err, foundCart) {
    foundCart.items.pull(String(req.params.product_id));
    console.log(foundCart.items)
    let total=0;
    for(let i=0;i<foundCart.items.length;i++){
      let itemPrice=foundCart.items[i].price;
      let itemQuantity=foundCart.items[i].quantity;
      total+=(parseFloat(itemPrice*itemQuantity))
    }
    foundCart.total = (parseFloat(total));
    foundCart.save(function(err) {
      if (err) return next (err); 
      else{
        console.log('Done')
      req.flash('remove','Succesfully Removed')
      return res.redirect('/cart');
      }
    });
  });
});

router.get('/cart/plus/:product_id',ensureAuthenticated,(req,res)=>{
  Cart.findOne({owner:req.user._id},(err,userCart)=>{
    if(err) 
      console.log('Cart Not Found '+ err);
    else{
      console.log('Cart Found');
      for(let i=0;i<userCart.items.length;i++){
        if(userCart.items[i].item==req.params.product_id){
          userCart.items[i].quantity++;
          break;
        };
      };
      let total=0;
      for(let i=0;i<userCart.items.length;i++){
          let itemPrice=userCart.items[i].price;
          let itemQuantity=userCart.items[i].quantity;
          total+=(parseFloat(itemPrice*itemQuantity))
      }
      userCart.total = (parseFloat(total));
      userCart.save((error)=>{
        if(error) console.log('Could not save item '+error);
        else{
          return res.redirect('/cart');
        }
      })
    };
  })
})

router.get('/cart/minus/:product_id',ensureAuthenticated,(req,res)=>{
  Cart.findOne({owner:req.user._id},(err,userCart)=>{
    if(err) 
      console.log('Cart Not Found '+ err);
    else{
      console.log('Cart Found');
      for(let i=0;i<userCart.items.length;i++){
        if(userCart.items[i].item==req.params.product_id){
          userCart.items[i].quantity--;
          break;
        };
      };
      let total=0;
      for(let i=0;i<userCart.items.length;i++){
          let itemPrice=userCart.items[i].price;
          let itemQuantity=userCart.items[i].quantity;
          total+=(parseFloat(itemPrice*itemQuantity))
      }
      userCart.total = (parseFloat(total));
      userCart.save((error)=>{
        if(error) console.log('Could not save item '+error);
        else{
          return res.redirect('/cart');
        }
      })
    };
  })
})

router.get('/cart/checkout',ensureAuthenticated,(req,res)=>{
  Cart.findOne({owner:req.user._id},(err,foundCart)=>{
    var today = new Date();
    var dd = String(today.getDate()+3).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm+ '/' + yyyy;
    const items=foundCart.items;
    const total=foundCart.total;
    res.render('checkout',{items,total,today,user:req.user,pay:total*100})
    console.log(items);
    console.log(total);
  })
})

module.exports = router;