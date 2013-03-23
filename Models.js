var appSettings = require('./settings').appSettings,
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: String,
	password: String
});

var User = mongoose.model('User', UserSchema);

exports.User = User;