var _ = require('underscore');

function Game(roomSize) {
	this.roomSize = roomSize;
	this.players = [];
};

Game.prototype.join = function(playerID) {
	this.players.push(playerID);
};

Game.prototype.leave = function(playerID) {
	var index = _.findWhere(this.players, {
		id: playerID
	});
	this.players.splice(index, 1);
};