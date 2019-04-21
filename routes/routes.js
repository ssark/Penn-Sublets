var express = require('express')
var router = express.Router();
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var cookieSession = require('cookie-session')

var User = require('../models/user')
var Listing = require('../models/listing')
var db = require('../models/kvs.js')

var getIndex = function(req, res) {
    res.render('index.ejs');
};

var getHome = function(req, res) {
  res.render('home.ejs', {user: req.session.email});
};

// Get Listing form
var getListingForm = function(req, res) {
  res.render('listing_form.ejs');
};

// Create listing
var createListing = function(req, res) {
  var email = req.session.email
  var {title, description} = req.body

  // trigger backend
  db.createListing(email, title, description, function(err, listingId) {
    if (err && listingId === null) {
      // TODO: ERROR CODE
      res.send(err)
    } else {
      console.log('in create listing')
      res.redirect('/listings/'+listingId)
    }
  });
};

var showListing = function(req, res) {
  var id = req.params.listingId
  db.getListingById(id, function(err, listing) {
    if (err) {
      res.send(err)
    } else {
      res.render('listing.ejs', listing)
    }
  });
};

var getEditListingForm = function(req, res) {
  var id = req.params.listingId
  db.getListingById(id, function(err, listing) {
    if (err) {
      res.send(err)
    } else {
      res.render('edit_listing.ejs', {title: listing.title, description: listing.description})
    }
  });
};

var updateListing = function(req, res) {
  var id = req.params.listingId
  var {title, description} = req.body
  // update on backend
  db.updateListing(id, title, description, function(err) {
    if (err) {
      res.send(err)
    } else {
      res.redirect('/listings/'+id);   // redrect to show page
    }
  });
};

var deleteListing = function(req, res) {
  var id =  req.params.listingId
  db.deleteListing(id, function(err, data) {
    if (err) {
      res.send(err)
    } else {
      res.send('success');
    }
  });
};

var routes = {
  getIndex: getIndex,
  getHome: getHome,
  getListingForm: getListingForm,
  createListing: createListing,
  showListing: showListing,
  getEditListingForm: getEditListingForm,
  updateListing: updateListing,
  deleteListing: deleteListing
};



module.exports = routes;