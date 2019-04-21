var mongoose = require('mongoose')
var Schema = mongoose.Schema;

const listingSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true},
  description: { type: String, required: true},
  date_posted: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Listing', listingSchema);