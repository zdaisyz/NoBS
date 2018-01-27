// app.js
const express = require('express');
const app = express();

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

// express session
const session = require('express-session');
const sessionOptions = {
	secret: 'super secret',
	resave: true,
	saveUnitialized: true
};
app.use(session(sessionOptions));

//* link db
require('./db');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Rating = mongoose.model('Rating');

//*/ set up passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

/* ********************* ROUTES *********************** */

app.get('/', function(req, res) {

	//res.send('hello');
	res.render('index', {user: req.user});
});

/* ************ User Authentication Stuff *****************/

app.get('/login', function (req, res) {
	res.render('login', {user: req.user});
});

app.post('/login', passport.authenticate('local'), function(req, res) {
	res.redirect('/');
});

app.get('/register', function(req, res) {
	res.render('register');
});

app.post('/register', function(req, res) {
	const pw = req.body.password;
	const name = req.body.username;
	User.register(new User({username: name, rating: 0}), pw, function(err, user) {
		if (err) {
			return res.render('register', {user: user});
		}
		passport.authenticate('local')(req, res, function () {
			res.redirect('/');
		});
	});
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});
//*/

app.listen(process.env.PORT || 5000);
console.log('Started server on port 5000');