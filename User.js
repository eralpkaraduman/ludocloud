var mongoose = require('mongoose');
var Models = require('./Models');
var _ = require('underscore');

function User(id) {
	this.id = id || _.uniqueId('_');
}

User.prototype.login = function(id, password) {
	
};

User.prototype.login = function(id, password) {
	
};

