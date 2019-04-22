var express = require('express')
var router = express.Router();
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var cookieSession = require('cookie-session')
var moment = require('moment')

var User = require('../models/user')
var Listing = require('../models/listing')
var db = require('../models/kvs.js')

var getIndex = function(req, res) {
    res.render('index.ejs');
};

var getHome = function(req, res) {
  db.getUserListings(req.session.email, function(err, listings) {
    if (err) {
      res.send(err)
    } else {
      console.log(moment(listings[0].date_posted))
      res.render('home.ejs', {user: req.session.email, allListings: listings});
    }
  });
  
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

// var getBookingForm = function(req, res) {
// // get listing for whom to book for in the params, render on the page

// };

var createBooking = function(req, res) {
  console.log('***************** in createBooking')
  var email = req.session.email
  var {listingId, dateFrom, dateTo} = req.body

  db.createBooking(email, listingId, dateFrom, dateTo, function(err, data) {
    if (data) {
      console.log('***** SUCCESS')
      res.status(200).send({'msg': 'success'});
    } else {
      console.log('***** gonna send error')
      res.status(500).send({'msg': 'error'});
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
  deleteListing: deleteListing,
  createBooking: createBooking
};



module.exports = routes;