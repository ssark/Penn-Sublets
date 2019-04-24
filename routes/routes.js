var express = require('express')
var router = express.Router();
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var cookieSession = require('cookie-session')
var moment = require('moment')
var fs = require('fs');
var multer = require('multer');

var User = require('../models/user')
var Listing = require('../models/listing')
var db = require('../models/kvs.js')

var getIndex = function(req, res) {
    res.render('index.ejs');
};

var getHome = function(req, res) {
  res.locals = req.session
  db.getAllListings(function(err, listings) {
    if (err) {
      res.send(err)
    } else {
      res.render('home.ejs', {user: req.session.username, allListings: listings, session: req.session});
    }
  });
  
};

// Get Listing form
var getListingForm = function(req, res) {
  res.locals = req.session
  res.render('listing_form.ejs', {session: req.session});
};

// Create listing
var createListing = function(req, res) {
  res.locals = req.session
  var email = req.session.email
  var {title, description} = req.body

  // trigger backend
  db.createListing(email, title, description, function(err, listingId) {
    res.locals = req.session
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
  res.locals = req.session
  var id = req.params.listingId
  res.locals = req.session
  db.getListingById(id, function(err, listing) {
    if (err) {
      res.send(err)
    } else {
      console.log("listing owner id: " + listing.owner._id + " sessio id: " + req.session.userId)
      if (listing.owner._id == req.session.userId) {
        res.render('listing.ejs', {listing: listing, curr: 1, session: req.session})
      } else {
        res.render('listing.ejs', {listing: listing, curr: 0, session: req.session})
      }
    }
  });
};

var getEditListingForm = function(req, res) {
  res.locals = req.session
  var id = req.params.listingId
  db.getListingById(id, function(err, listing) {
    if (err) {
      res.send(err)
    } else {
      res.render('edit_listing.ejs', {title: listing.title, description: listing.description, session: req.session})
    }
  });
};

var updateListing = function(req, res) {
  res.locals = req.session
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
  res.locals = req.session
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
  res.locals = req.session
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
  res.locals = req.session
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
  res.locals = req.session
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
  res.locals = req.session
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
  res.locals = req.session
  var myId = req.session.userId
  var userId = req.params.userId
  console.log("myId: " + myId + " userId: " + userId)
  db.getUserListings(userId, function(lErr, user) {
    if (lErr) {
      res.status(500).send(lErr)
    } else {
      console.log("user coming back: " + user)
      if (userId == myId) { // myProfile
        db.getUserBookings(userId, function(err, bookings) {
          if (err) {
            res.status(500).send(lErr)
          } else {
            res.render('profile.ejs', {curUsername: user.name, bookings: bookings, listings: user.listings});
          }
        });
      } else { // someone else's profile
        res.render('profile.ejs', {currUsername: user.name, listings: user.listings, bookings: null});
      }
    }
  });
}

var getSearchSug = function(req, res) {
  console.log("in get search sug")
  arr = []
  term = req.body.search_term

  db.searchListingTitle(term, function(lErr, listings) {
    if (lErr) {
      res.status(500).send(lErr)
    } else {
      db.searchUserName(term, function(uErr, users) {
        if (uErr) {
          res.status(500).send(uErr)
        } else {
          listings.forEach(function(l) {
            arr.push({label: "Listing: " + l.title, value: l._id, isUser: 0})
          })
          users.forEach(function(u) {
            arr.push({label: "User:" + u.name, value: u._id, isUser: 1})
          })
          res.send(arr)
        }
      })
    }
  })
}

// var savePhoto = function(req, res) {
//   var newPic = new Picture();
//   newPic.img.data = fs.readFileSync(req.files.userPhoto.path)
//   newPic.img.contentType = 'image/png';
//   newPic.save();
// }

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
  getProfile: getProfile,
  getSearchSug: getSearchSug
};



module.exports = routes;