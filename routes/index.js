const express = require('express');
const router = express.Router();
const Products = require('../models/products');
const Cart =  require('../models/cart');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const cart = require('../models/cart');
const User = require('../models/User');
const category = require('../models/category');
const { search } = require('./main');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('home',{title:'Home'}));

// Dashboard
router.get('/home', (req, res) =>
  res.render('home', {
    user: req.user,
    title:'Home'
  })
);

//Gifts Categ
router.get('/gifts',(req,res)=>{
  Products.find({category:'5ef7479b3cf6df47c0ff81aa'},(err,prods)=>{
    if(err) console.log(err);
    else{
      const few=prods.slice(0,4);
      res.render('flowers',{user:req.user, title:'Gifts',few,prods});
    }
  })
})

//Flowers Categ
router.get('/flowers',(req,res)=>{
  Products.find({category:'5f0459ee75bcb04384625b3e'},(err,prods)=>{
    if(err) console.log(err);
    else{
      const few=prods.slice(0,4);
      res.render('gifts',{user:req.user, title:'Flowers',few,prods});
    }
  })
});

//Anniversary categ
router.get('/anniversary',(req,res)=>{
  Products.find({category:'5f06f6d0fa1c2428a838725c'},(err,prods)=>{
    if(err) console.log(err);
    else{
      const few=prods.slice(0,4);
      res.render('prod',{user:req.user, title:'Anniversary',few,prods});
    }
  })
});

router.get('/birthday',(req,res)=>{
  Products.find({category:'5f105b25f19dcc4828a28f48'},(err,prods)=>{
    if(err) console.log(err);
    else{
      res.render('prod',{title:'Birthday',user:req.user});
    }
  })
})

//Profile Edit
router.get('/edit' , ensureAuthenticated, (req,res)=>{
  res.render('edit',{user:req.user, title:req.user.name})
});

router.post('/edit',ensureAuthenticated,(req,res)=>{
  const newAddresss=req.body.address;
  User.findOne({_id:req.user._id},(err,user)=>{
    if(err) console.log(err);
    else{
      user.address=newAddresss;
      user.save()
      .then(res.redirect('/home'))
    }
  })  
})

//Cart Page
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

//All Products Page
router.get('/products', async (req,res)=>{
  const prods= await Products.find({});
  res.render('prod',{prods, user:req.user,title:'All Products'});
});

router.post('/search', function(req, res, next) {
  category.findOne({name:req.body.search},(err,categ)=>{
    if(err)  console.log(err);
    else{
      console.log(categ);
      Products.find({ $or:[ {name:req.body.search}, {category:categ._id} ]},(err,prods)=>{
        if(err) console.log(err);
        else  res.render('prod',{prods,user:req.user});
      })
    }
  })
});

// router.get('/search', function(req, res, next) {
//   if (req.query.q) {
//     Products.search({
//       query_string: { query: req.query.q}
//     }, function(err, results) {
//       results:
//       if (err) return next(err);
//       var data = results.hits.hits.map(function(hit) {
//         return hit;
//       });
//       res.render('prod', {
//         prods:data,
//       });
//     });
//   }
// });

//Profile
router.get('/profile',ensureAuthenticated, (req,res)=>{
  const id=req.user._id;
  const {name,email,phone,history}=req.user;
  const last=history[0];
  res.render('profile',{name,email,phone,last,history,user:req.user})
});

//Push to Cart
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
      image:req.body.image,
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

//Single Product Page
router.get('/viewprod/:product_id',ensureAuthenticated,(req,res)=>{
  const prod=req.params.product_id;
  Products.findOne({_id:prod},(err,prodFound)=>{
    res.render('singleProd',{prodFound})
  })
})

//Delete From Cart
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

//Add Quantity
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

//Lower Quantity
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


//Checkout Page
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

//Exports
module.exports = router;