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
app.set('view engine', 'html');

app.use('/static', express.static(path.join(__dirname, 'static')))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cookieSession({
  name: 'local-session',
  keys: ['spooky'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.get('/', routes.getIndex);


app.get('/home', function (req, res, next) {
	res.render('home', {user: req.session.email});
});


app.use('/account', accountRouter)







// ********************************************
app.use(function (err, req, res, next) {
  return res.send('ERROR :  ' + err.message)
})

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})
