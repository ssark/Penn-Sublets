var mongoose = require('mongoose')

const listingSchema = new mongoose.Schema({
  name: String,
  user: String,
  description: String,
  price: Number,
  bookings: [{ date: Date, user: String }],
  comments: [{ body: String, date: Date }]
})

module.exports = mongoose.model('Listing', listingSchema);