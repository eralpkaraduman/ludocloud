var appSettings = require('./settings').appSettings,
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	models = require('./Models'),
	crypto = require('crypto');

var words = [
    "ADVENTURE",
    "BIRTHDAY",
    "CANARY",
    "DICTIONARY",
    "EXCEPT",
    "FRUSTRATED",
    "GRAMMAR",
    "HOROSCOPE",
    "IRELAND",
    "JOURNAL",
    "KEYWORD",
    "LIGHT",
    "MONOCLE",
    "NATURAL",
    "ORACLE",
    "PROCEDURE",
    "RADICAL",
    "STANDARD",
    "TRANSFER",
    "URINATE",
    "XENOPHOBIA",
    "YELLOW",
    "ZOOLOGY",
    "WIKIPEDIA",
    "ALASKA",
    "ARCADE",
    "DINOSAUR",
    "METEOROID",
    "UTILITY",
    "PENCIL",
    "ABANDON",
    "STATUS",
    "UNCANNY",
    "MILITARY",
    "ZACKARY"
];

function getRandomWord(){
    var w = words[Math.round(Math.random()*(words.length-1))];
    return w;
}
	
var DB = {};

DB.connect = function(cb) {
	mongoose.connect(appSettings.mongoUrl, cb);
};

DB.getWord = function(cb) {
	var word = getRandomWord();
	cb(null, word);
}

/* USERS */

DB.newUser = function(data, cb) {
	var user = new models.User(data);
	user.save(cb);
}

DB.findUser = function(id, cb) {
	var self = this;
	models.User.findOne().where('id', id).exec(function(error, match) {
		if(error) { cb(error) } 
		else {
			if(match) {
				console.log('found');
				cb(null, match);
			} else {
				//
				console.log('not found');
				/*self.newUser(document, function(error, hasCreated) {
					console.log('new user');
					if(!error && hasCreated) {
						self.findUser(document, cb);
					}
				});*/
			}
		}
	});
};

DB.findUserbyUsername = function(username, cb) {
	var self = this;
	models.User.findOne().where('username', username).exec(function(error, match) {
		if(error) { cb(error) } 
		else {
			if(match) {
				console.log('found');
				cb(null, match);
			} else {
				console.log('not found');
			}
		}
	});
};

exports.DB = DB;