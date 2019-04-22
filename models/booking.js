var mongoose = require('mongoose')
var Schema = mongoose.Schema;

const bookingSchema = new Schema({
  booker: { type: Schema.Types.ObjectId, ref: 'User' },
  listing: { type: Schema.Types.ObjectId, ref: 'Listing' },
  date_from: { type: Date, required: true},
  date_to: { type: Date, required: true}
});


module.exports = mongoose.model('Booking', bookingSchema);