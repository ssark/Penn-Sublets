var express = require('express')
var router = express.Router();
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var cookieSession = require('cookie-session')

var User = require('../models/user')

var getIndex = function(req, res) {
    res.render('index.ejs');
};


var routes = {
  getIndex: getIndex
};
module.exports = routes;