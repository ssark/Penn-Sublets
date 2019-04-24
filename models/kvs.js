var mongoose = require('mongoose')
var User = require('./user')
var Listing = require('./listing')
var Booking = require('./booking')
var Review = require('./review')
var moment = require('moment')
var fs = require('fs');
var multer = require('multer');

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
  Listing.findById(id).populate('owner').exec(function(err, listing) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, listing);
    }
  });
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
  Booking.find({listing: id}).remove(function(bErr, bookings) {
    if (bErr) {
      callback(bErr, null);
    } else {
      Listing.findByIdAndRemove(id, function(lErr, listing) {
        if (lErr) {
          callback(lErr, null);
        } else {
          callback(null, listing);
        }
      });
    }
  });
}

var getUserListings = function(userId, callback) {
  User.findOne({ _id: userId }).populate('listings').exec(function(err, user) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, user);
    }
  })
};

// takes user instance
var getUserBookings = function(userId, callback) {
  User.findOne({ _id: userId }, function(uerr, user) {
    if (uerr) {
      callback(uerr, null);
    } else {
      // callback(null, user.listings);
      console.log(user)
      Booking.find({booker: user}).populate('listing').exec(function(err, bookings) {
        if (err) {
          callback(err, null)
        } else {
          callback(null, bookings)
        }
      });
    }
  })
}

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
            callback('Those dates are not available. Try again!', null) // Already booked for those dates
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
  console.log('in db createReview ' +  email)
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
              console.log("******* the review", review)
              callback(null, review)
            }
          })
        }
      });
    }
  });
};

var getListingReviews = function(listingId, callback) {
  Review.find({listing: listingId}).populate('user').exec(function(err, reviews) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, reviews)
    }
  });
};

var getUserProfile = function(userId, callback) {
  User.findOne({ _id: userId }).populate('listings').exec(function(err, user) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, user);
    }
  })
}

// callback (err, listings)
var getAllListings = function(callback) {
  Listing.find({}).populate('owner').exec(function(err, data) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, data)
    }
  });
}

// callback (err, users)
var getAllUsers = function(callback) {
  User.find({}, function(err, data) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, data)
    }
  });
}

// callback (err, listings)
var searchListingTitle = function(term, callback) {
  Listing.find({title: { "$regex": term, "$options": "i" }}).populate('owner').exec(function(err, data) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, data)
    }
  });
}

// callback (err, users)
var searchUserName = function(term, callback) {
  User.find({name: { "$regex": term, "$options": "i" }}, function(err, data) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, data)
    }
  });
}

var addImageListing = function(listingId, imageId, callback) {
  Listing.findById(listingId, function(findErr, listing) { 
    if (listing) {
      listing.images.push(imageId);
      listing.save(function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, listing)
        }
      });
    } else {
      callback(findErr, null);
    }
  });
} 


var getListingImages = function(listingId, callback) {
  Listing.findById(listingId, function(findErr, listing) { 
    if (findErr || listing.images == null) {
      callback(findErr, null);
    } else {
      callback(null, listing.images)
    }
  });
} 

var db = {
  createListing: createListing,
  getListingById: getListingById,
  updateListing: updateListing,
  deleteListing: deleteListing,
  getUserListings: getUserListings,
  createBooking: createBooking,
  createReview: createReview,
  getListingBookings: getListingBookings,
  getListingReviews: getListingReviews,
  getUserBookings: getUserBookings,
  getUserProfile: getUserProfile,
  getAllListings: getAllListings,
  getAllUsers: getAllUsers,
  searchListingTitle: searchListingTitle,
  searchUserName: searchUserName,
  addImageListing: addImageListing,
  getListingImages: getListingImages


}

module.exports = db;