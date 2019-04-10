var express = require('express')
var router = express.Router();
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var cookieSession = require('cookie-session')

var User = require('../models/user')
var isAuthenticated = require('../middlewares/isAuthenticated')

router.get('/signup', function (req, res, next) {
  res.render('signup')
})

router.post('/signup', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var u = new User({ username: username, password: password })
  u.save(function (err, result) { 
    if (err) {
      next(err)
    } else {
      res.redirect('/account/login')
    }
  })
})

router.get('/login', function (req, res) {
  res.render('login')
})

router.post('/login', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({ username: username, password: password }, function (err, result) { 
    if (!err && result != null) {
      req.session.user = username;
      res.redirect('/')
    } else {
      next(new Error('Invalid credentials'))
    }
  })
})

router.get('/logout', isAuthenticated, function (req, res) {
  req.session.user = '';
  res.redirect('/')
})
module.exports = router;
