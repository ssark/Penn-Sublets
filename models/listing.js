var mongoose = require('mongoose')

const listingSchema = new mongoose.Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true},
  description: { type: String, required: true},
  date_posted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', listingSchema);