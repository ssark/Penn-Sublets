var mongoose = require('mongoose')
var User = require('./user')
var Listing = require('./listing')


var createListing = function(email, title, description, callback) {
  // create the new listing
  // find the person with the email
  // save listing
  // update person listing arr
  User.findOne({email: email}, function(findErr, user) { 
    if (user) {
      console.log(user.listings)
      var newListing = new Listing({ owner: user._id, title: title, description: description});
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

var db = {
  createListing: createListing,
  getListingById: getListingById,
  updateListing: updateListing,
  deleteListing: deleteListing
}

module.exports = db;