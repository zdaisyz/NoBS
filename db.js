const mongoose = require('mongoose');
//const URLSlugs = require('mongoose-url-slugs');
const passportLocalMongoose = require('passport-local-mongoose');

const User = new mongoose.Schema({
	name: String,
	password: String
});

const Rating = new mongoose.Schema({
	stars: Number,
	review: String
});

User.plugin(passportLocalMongoose);

mongoose.model('User', User);
mongoose.model('Rating', Rating);

var uristring = process.env.MONGODB_URI ||
	'mongodb://localhost/nobs';

mongoose.connect(uristring, function (err, res) {
	if (err) {
		console.log('ERROR connecting to: ' + uristring + '- ' + err);
	}
	else {
		console.log('Succeeded connected to: ' + uristring);
	}
});