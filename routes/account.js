var express = require('express')
var router = express.Router();
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var cookieSession = require('cookie-session')

var User = require('../models/user')
var validCodes = require('../public/validCodes')

router.get('/signup', function (req, res, next) {
  console.log('in get account/signup')
  // check for invalid entries to form
  console.log(req.query)
  if (req.query.valid == validCodes.userExists.num) {
    res.render('signup.ejs', {message: validCodes.userExists.msg});
  } else if (req.query.valid == validCodes.serverError.num) {
    console.log("server error in render")
    console.log(req.query.valid)
    res.render('signup.ejs', {message: validCodes.serverError.msg});
  } else {
    console.log("render normally")
    res.render('signup.ejs', {message: ""}); // render normally
  }
})

router.post('/signup', function (req, res, next) {
  console.log('trying to post')
  var {name, email, password} = req.body;
  User.addUser(name, email, password, function(errorNum, errormsg) {
    if (errorNum === null && errormsg === null) {
      // Render the home page
      // req.session.email = email
      // res.redirect('/home');
      res.send('success')
    } else {
      // Invalid signup
      res.redirect('/account/signup?valid='+errorNum);
    }
  });
})

router.get('/login', function (req, res) {
  res.render('login')
})

router.post('/login', function (req, res, next) {
  var {email, password} = req.body;
  User.verifyCreds(email, password, function(err, verified) {
    if (err) {
      res.send(err);
    } else if (!verified) {
      res.send('Wrong creds');
    } else {
      // res.send('going to log in' + email);
      // Render the home page
      req.session.email = email
      res.redirect('/home');
    }
  });
})

// router.get('/logout', function (req, res) {
//   req.session.user = '';
//   res.redirect('/')
// })
module.exports = router;
