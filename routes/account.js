var express = require('express')
var router = express.Router();
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var cookieSession = require('cookie-session')

var User = require('../models/user')
var validCodes = require('../public/validCodes')

router.get('/signup', function (req, res, next) {
  // check for invalid entries to form
  if (req.query.valid == validCodes.userExists.num) {
    res.render('signup.ejs', {message: validCodes.userExists.msg});
  } else if (req.query.valid == validCodes.serverError.num) {
    res.render('signup.ejs', {message: validCodes.serverError.msg});
  } else {
    res.render('signup.ejs', {message: ""}); // render normally
  }
})

router.post('/signup', function (req, res, next) {
  var {name, email, password} = req.body;
  User.addUser(name, email, password, function(errorNum, errormsg) {
    if (errorNum === null && errormsg !== null) {
      // Render the home page
      req.session.email = email
      req.session.user_id = user._id
      res.redirect('/home');
    } else {
      // Invalid signup
      res.redirect('/account/signup?valid='+errorNum);
    }
  });
})

router.get('/login', function (req, res) {
  // check for invalid entries to login form
  if (req.query.valid == validCodes.serverError.num) {
    res.render('login.ejs', {message: validCodes.serverError.msg});
  } else if (req.query.valid == validCodes.accountNotExist.num) {
    res.render('login.ejs', {message: validCodes.accountNotExist.msg});
  } else if (req.query.valid == validCodes.wrongCreds.num) {
    res.render('login.ejs', {message: validCodes.wrongCreds.msg});
  } else {
    res.render('login.ejs', {message: ""}); // render normally
  }
})

router.post('/login', function (req, res, next) {
  var {email, password} = req.body;
  User.verifyCreds(email, password, function(errNum, verified) {
    if (errNum && verified === null) {
      res.redirect('/account/login?valid='+errNum);
    } else if (!verified) { // wrong password
      res.redirect('/account/login?valid='+validCodes.wrongCreds.num);
    } else {
      // successful
      req.session.email = email
      req.session.userId = verified._id
      console.log(req.session)
      res.redirect('/home');
    }
  });
})

router.get('/logout', function (req, res) {
  req.session.user = '';
  res.redirect('/')
})
module.exports = router;
