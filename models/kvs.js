var mongoose = require('mongoose')
var User = require('./user')
var Listing = require('./listing')
var Booking = require('./booking')
var moment = require('moment')

var createListing = function(email, title, description, callback) {
  User.findOne({email: email}, function(findErr, user) { 
    if (user) {
      var newListing = new Listing({ owner: user, title: title, description: description});
      newListing.save(function(listingErr, listing) {
        if (listingErr) {
          callback(listingErr, null);
        } else {
          user.listings.push(newListing);
          user.save(function(err) {
            if (err) {
              callback(err, null);
            } else {
              callback(null, listing.id)
            }
          });
        }
      });
    } else {
      callback(findErr);
    }
  });
};

// callback(err, data)
var getListingById = function(id, callback) {
  Listing.findById(id, function(err, listing) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, listing);
    }
  })
};

// callback(err)
var updateListing = function(id, title, description, callback) {
  Listing.findById(id, function(err, listing) {
    if (err) {
      callback(err);
    } else {
      console.log('found listing')
      if (listing.title !== title || listing.description !== description) {
        listing.title = title;
        listing.description = description;
        listing.save(callback);
      } else {
        callback(null);
      }
      
    }
  })
};

// callback (err, data)
var deleteListing = function(id, callback) {
  Listing.findByIdAndRemove(id, function(err, data) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  })
}

var getUserListings = function(email, callback) {
  User.findOne({ email: email }).populate('listings').exec(function(err, user) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, user.listings);
    }
  })
};

// callback(err, data)
var createBooking = function(email, listingId, date_to, date_from, callback) {
  console.log('in db createBooking')
  User.findOne({email: email}, function(userErr, user) { 
    if (userErr) {
      callback(userErr, null);
    } else {
      console.log('found user')
      console.log(user)
      Listing.findById(listingId, function(listingErr, listing) {
        if (listingErr) {
          callback(listingErr, null);
        } else {
          console.log('found listing')
          console.log(listing)
          var newBooking = new Booking({ booker: user, listing: listing, date_from: date_from, date_to: date_to});
          newBooking.save(function(bookingErr, booking) {
            if (bookingErr) {
              callback(bookingErr, null)
            } else {
              console.log('success booking')
              callback(null, booking)
            }
          })
        }
      });
    }
  });
};

var db = {
  createListing: createListing,
  getListingById: getListingById,
  updateListing: updateListing,
  deleteListing: deleteListing,
  getUserListings: getUserListings,
  createBooking: createBooking,
  
}

module.exports = db;