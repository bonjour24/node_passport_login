const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const expbs=require('express-handlebars');
const path=require('path');
const mainRoute = require('./routes/main');
const Cart =  require('./models/cart');
const bcrypt=require('bcryptjs');
const fx=require('money');
fx.base = "EUR";
fx.rates = {
  "EUR" : 1, // eg. 1 USD === 0.745101 EUR
  "INR" : 93.328,
}
console.log(fx(1.99).from("EUR").to("INR"))

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// const vendor = require('./models/vendor');
// const vendy = new vendor({
//   name:'EnR',
//   email:'e@e',
//   password:'adminpass'
// });
// vendy.save((err)=>{
//   if(err) console.log(err);
//   else console.log("Added");
// })
const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
// app.use(expressLayouts);
// app.set('view engine', 'ejs');
app.engine('handlebars',expbs({
  defaultLayout:'main',
  layoutsDir:path.join(__dirname,'views/layouts')
}));
app.set('view engine','handlebars');
app.use(express.static('public'));
app.use('/',express.static(__dirname+'/public'));


// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/vendor',require('./routes/vendor.js'));
app.use('/prod',require('./routes/products.js'));
app.use(mainRoute);

const PORT = process.env.PORT || 10000;


app.listen(PORT, console.log(`Server started on port ${PORT}`));

