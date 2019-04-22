var mongoose = require('mongoose')
var User = require('./user')
var Listing = require('./listing')
var Booking = require('./booking')
var Review = require('./review')
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

// callback(err, bookings)
var getListingBookings = function(listingId, callback) {
  Booking.find({listing: listingId}, function(err, bookings) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, bookings)
    }
  });
};

// callback(err, data)
var createBooking = function(email, listingId, date_from, date_to, callback) {
  console.log('in db createBooking')
  User.findOne({email: email}, function(userErr, user) { 
    if (userErr) {
      callback(userErr, null);
    } else {
      console.log('found user')
      console.log(user)

      Booking.find({listing: listingId}, function(bErr, bookings) {
        if (bErr) {
          callback(bErr, null);
        } else {
          console.log('found bookings')
          isOverlap = false
          bookings.forEach(function(b) {
            var bfrom = moment(b.date_from)
            var bto = moment(b.date_to)

            var nFrom = moment(date_from)
            var nTo = moment(date_to)

            if (nFrom.isBetween(bfrom, bto, null, '[]') || nTo.isBetween(bfrom, bto, null, '[]')) {
              console.log('Already booked for those dates!')
              isOverlap = true
            }
          });

          if (isOverlap) {
            callback('Already booked for those dates!', null) // Already booked for those dates
          } else { // Create booking
            var newBooking = new Booking({ booker: user, listing: listingId, date_from: date_from, date_to: date_to});
            newBooking.save(function(bookingErr, booking) {
              if (bookingErr) {
                callback(bookingErr, null)
              } else {
                console.log('success booking')
                callback(null, booking)
              }
            })
          }
        }
      });
    }
  });
};

// callback(err, data)
var createReview = function(email, listingId, title, text, callback) {
  console.log('in db createReview')
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
          var newReview = new Review({ user: user, listing: listing, title: title, text: text});
          newReview.save(function(reviewErr, review) {
            if (reviewErr) {
              callback(reviewErr, null)
            } else {
              console.log('success review')
              callback(null, review)
            }
          })
        }
      });
    }
  });
};

var getListingReviews = function(listingId, callback) {
  Review.find({listing: listingId}, function(err, reviews) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, reviews)
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
  createReview: createReview,
  getListingBookings: getListingBookings,
  getListingReviews: getListingReviews


}

module.exports = db;