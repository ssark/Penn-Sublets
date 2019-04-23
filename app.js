var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var mongoose = require('mongoose');
var app = express();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/penn-sublet')

var routes = require('./routes/routes.js');
var accountRouter = require('./routes/account.js')

app.engine('html', require('ejs').__express);
app.set('view engine', 'ejs');
app.locals.moment = require('moment');

app.use('/static', express.static(path.join(__dirname, 'static')))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cookieSession({
  name: 'local-session',
  keys: ['spooky'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// Misc
app.get('/', routes.getIndex);
app.get('/home', routes.getHome);


// Booking pages
app.post('/createBooking', routes.createBooking);
app.post('/createReview', routes.createReview);

// Listing pages
app.get('/newListing', routes.getListingForm);
app.post('/newListing', routes.createListing);

app.get('/listings/:listingId', routes.showListing);

app.get('/listings/edit/:listingId', routes.getEditListingForm);
app.post('/listings/edit/:listingId', routes.updateListing);

app.delete('/listings/delete/:listingId', routes.deleteListing);



app.use('/account', accountRouter)







// ********************************************
app.use(function (err, req, res, next) {
  return res.send('ERROR :  ' + err.message)
})

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})
