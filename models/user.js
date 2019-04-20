var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var validCodes = require('../public/validCodes')

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  listings: [{ type: Schema.Types.ObjectId, ref: 'Listing' }]
});

// var UserSchema = mongoose.model('User', userSchema)

// callback(errorNum, errormsg)
userSchema.statics.addUser = function(name, email, password, callback) {
  console.log('in adduser')
  this.findOne({ email: email}, function(findErr, user) {
    if (findErr) {
      callback(validCodes.serverError.num, findErr);
    } else if (user) { // User account already exists
      callback(validCodes.userExists.num, validCodes.userExists.msg);
    } else {
      var newUser = new this({ name: name, email: email, password: password, listings: []});
      newUser.save(function(err, result) {
        if (err) {
          callback(validCodes.serverError.num, err);
        } else {
          callback(null, null); // success saving user
        }
      });
    }
  });
}

userSchema.statics.verifyCreds = function(email, password, callback) {
  this.findOne({ email: email }, function(err, user) {
    if (err) {
      callback(err, null);
    } else if (!user) {
      callback('Account does not exist', null);
    } else {
      if (password === user.password) {
        callback(null, true); // sending true for verified creds back
      } else {
        callback(null, false);
      }
    }
  });
}

userSchema.statics.verifyCreds = function(email, password, callback) {
  this.findOne({ email: email }, function(err, user) {
    if (err) {
      callback(err, null);
    } else if (!user) {
      callback('Account does not exist', null);
    } else {
      if (password === user.password) {
        callback(null, true); // sending true for verified creds back
      } else {
        callback(null, false);
      }
    }
  });
}



module.exports = mongoose.model('User', userSchema);
