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
  db.getAllListings(function(err, listings) {
    if (err) {
      res.send(err)
    } else {
      res.render('home.ejs', {user: req.session.username, allListings: listings});
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
      // console.log('in create listing')
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
      console.log("listing owner id: " + listing.owner._id + " sessio id: " + req.session.userId)
      if (listing.owner._id == req.session.userId) {
        res.render('listing.ejs', {listing: listing, curr: 1})
      } else {
        res.render('listing.ejs', {listing: listing, curr: 0})
      }
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

var createBooking = function(req, res) {
  var email = req.session.email
  var {listingId, dateFrom, dateTo} = req.body

  db.createBooking(email, listingId, dateFrom, dateTo, function(err, data) {
    if (data) {
      res.json({'msg': 'Booking successful!'});
    } else {
      res.status(500).json({'msg': err});
    }
  });
};

var getBookings = function(req, res) {
  var listingId = req.query.listingId

  db.getListingBookings(listingId, function(err, bookings) {
    if (err) {
      res.status(500).json({'msg': err});
    } else {
      res.json(bookings);
    }
  })
}

var createReview = function(req, res) {
  var email = req.session.email
  var {listingId, title, text} = req.body

  db.createReview(email, listingId, title, text, function(err, data) {
    if (data) {
      res.json(data);
    } else {
      res.status(500).json({'msg': err});
    }
  });
};

var getReviews = function(req, res) {
  var listingId = req.query.listingId

  db.getListingReviews(listingId, function(err, reviews) {
    if (err) {
      res.status(500).json({'msg': err});
    } else {
      res.json(reviews);
    }
  })
};

var getProfile = function(req, res) {
  var myId = req.session.userId
  var userId = req.params.userId

  db.getUserListings(userId, function(lErr, user) {
    if (lErr) {
      res.status(500).send(lErr)
    } else {
      if (userId == myId) { // myProfile
        db.getUserBookings(userId, function(err, bookings) {
          if (err) {
            res.status(500).send(lErr)
          } else {
            res.render('profile.ejs', {username: user.name, bookings: bookings, listings: user.listings});
          }
        });
      } else { // someone else's profile
        res.render('profile.ejs', {username: user.name, listings: user.listings, bookings: null});
      }
    }
  });


}

var routes = {
  getIndex: getIndex,
  getHome: getHome,
  getListingForm: getListingForm,
  createListing: createListing,
  showListing: showListing,
  getEditListingForm: getEditListingForm,
  updateListing: updateListing,
  deleteListing: deleteListing,
  createBooking: createBooking,
  createReview: createReview,
  getBookings: getBookings,
  getReviews: getReviews,
  getProfile: getProfile
};



module.exports = routes;