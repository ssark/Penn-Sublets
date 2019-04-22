var mongoose = require('mongoose')
var Schema = mongoose.Schema;

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  listing: { type: Schema.Types.ObjectId, ref: 'Listing' },
  date_posted: { type: Date, default: Date.now},
  title: String,
  text: String
});


module.exports = mongoose.model('Review', reviewSchema);