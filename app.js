var express = require('express'),
	routes = require('./routes'),
  	http = require('http'),
	url = require('url'),
  	db = require('./db').DB,
  	_ = require('underscore'),
  	appSettings = require('./settings').appSettings,
	crypto = require('crypto'),
	handlers = {};

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

checkObject = {};

function getIDFromToken(token) {
	var decipher = crypto.createDecipher('aes256', 'bahadir')
	var decrypted = decipher.update(token, 'hex', 'utf8')
	decrypted += decipher.final('utf8')
	console.log('dec', decrypted);
	// TODO: validate
	var id = decrypted.split('|')[0];
	return id;
}

function getTokenFromID(id) {
	var plainToken = id + '|' + new Date().getTime();
	var cipher = crypto.createCipher('aes256', 'bahadir');
	var crypted = cipher.update(plainToken, 'utf8','hex');
	crypted += cipher.final('hex');
	return crypted;
}

function requireAuthentication(req, res, next) {
	var queryData = url.parse(req.url, true).query;
		console.log(queryData);
	var id = getIDFromToken(queryData.token);
	console.log(id);
	next();
}

handlers.unique = function(req, res) {
	var uniqueID = new Date().getTime() + '' + Math.round(Math.random() * 100000);
	checkObject[uniqueID] = '';
	res.send({
		success: true,
		uniqueID: uniqueID
	});
};

handlers.status = function(req, res) {
	var status = checkObject[req.params.id];
	if(status) {
		res.send({
			success: true,
			token: status
		});
	} else {
		res.send({
			success: true,
			token: ''
		});
	}
};

handlers.loginWindow = function(req, res) {
	var checkID = req.params.id;
	res.render('login', {
		title: 'Express',
		checkID: checkID
	});
};

handlers.signupWindow = function(req, res) {
	var checkID = req.params.id;
	res.render('signup', {
		title: 'Express',
		checkID: checkID
	});
};

app.all('/api/*', requireAuthentication);

app.get('/', function(req, res) {
	console.log('a');
	res.send('a');
});

app.get('/user/:id', function(req, res){
  res.send('user ' + req.params.id);
});

app.get('/loginWindow/:id', handlers.loginWindow);
app.post('/login', function(req, res) {
	var cipher = crypto.createCipher('aes256', 'bahadir');
	var crypted = cipher.update(req.body.password, 'utf8','hex');
	crypted += cipher.final('hex');
	db.findUserbyUsername(req.body.username, function(error, user) {
		if(!error) {
			if(user.password === crypted) {
				var token = getTokenFromID(user._id);
				checkObject[req.body.checkID] = token;
				console.log(checkObject);
				res.send({
					success: 'success',
					token: token,
					login: true
				});
			} else {
				res.send({
					success: true,
					login: false,
					token: null
				});
			}
		} else {
			res.send({
				success: false,
				message: 'Generic Error'
			});
		}
	});
});

app.get('/signupWindow/:id', handlers.signupWindow);
app.post('/signup', function(req, res) {
	var cipher = crypto.createCipher('aes256', 'bahadir');
	var crypted = cipher.update(req.body.password, 'utf8','hex');
	crypted += cipher.final('hex');
	db.newUser({
		username: req.body.username,
		password: crypted
	}, function(error, user) {
		if(!error) {
			var token = getTokenFromID(user._id);
			checkObject[req.body.checkID] = token;
			res.send('OK');
		} else {
			res.send('Error');
		}
	});
});

app.get('/unique', handlers.unique);
app.get('/status/:id', handlers.status);

var games =  [];
var MAX_HIDDEN = 8;

function createGame(callback){
	db.getWord(function(error, data) {
		if(!error) {
		    var word = data;
		    var hiddenIndexes = puzzle(word);
		    var problem = word.split("");
		    var correctValues = [];

		    for(var i=0; i<hiddenIndexes.length; i++){
		        correctValues.push(problem[hiddenIndexes[i]]);
		        problem[hiddenIndexes[i]] = "*";
		    }
		    var keyboard = makeKeyboard(correctValues);

		    var gameData = {
		        word:word,
		        problem:problem.join(""),
		        hiddenIndexes:hiddenIndexes,
		        correctValues:correctValues,
		        keyboard:keyboard
		    }

		    console.log(word);
		    console.log(hiddenIndexes);
		    console.log(correctValues);
		    console.log(keyboard);

		    games.push(gameData);
			callback(null, games.length - 1);
		}
	});
}

function puzzle(word){


    var numHidden = Math.floor(word.length*0.30);
    if(numHidden>MAX_HIDDEN)numHidden = MAX_HIDDEN;

    var hiddenIndexes = [];
    console.log(numHidden);

    while(hiddenIndexes.length<numHidden){
        var t = Math.round(Math.random()*(word.length-1));

        while(hiddenIndexes.indexOf(t)>-1){
            t = Math.round(Math.random()*(word.length-1));
        }

        hiddenIndexes.push(t);

    }

    return hiddenIndexes;
}


function makeKeyboard(correctValues){
    var alph = "ABCDEFGHIJKLMNOPRSTYUXVWZ";
    alph = alph.split("");
    var keys = [];

    for(var i=0;i<correctValues.length;i++){
        keys.push(correctValues[i]);
    }

    while(keys.length<MAX_HIDDEN){
        keys.push(alph[Math.round(Math.random()*(alph.length-1))]);
    }
    keys = shuffle(keys);
    keys = shuffle(keys);
    keys = shuffle(keys);
    return keys;
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

app.get('/api/joinGame', function(req, res){
	createGame(function(error, data) {
		var gameId = data;
	    var o = {
	        status:true,
	        game:{
	            id:gameId,
	            problem:games[gameId].problem,
	            hiddenIndexes:games[gameId].hiddenIndexes,
	            keyboard:games[gameId].keyboard.join("")
	        }
	    }
	    res.write(JSON.stringify(o));
	    res.end();
	});
});

db.connect(function() {	
	console.log(arguments);
	http.createServer(app).listen(app.get('port'), function(){
	  console.log("Express server listening on port " + app.get('port'));
	});
});
