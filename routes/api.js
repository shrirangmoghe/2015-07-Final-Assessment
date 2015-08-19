var credentials = (require('fs').existsSync('credentials.js') ?
    require('../credentials')
  : (console.log ('No credentials.js file present, assuming using CONSUMERKEY & CONSUMERSECRET system variables.'), require('../credentials_'))) ;
var express = require('express');
var request = require('request');
var router = express.Router();
var crypto = require('crypto');
var buffer = require('buffer');
var algorithm = 'aes-256-ctr';
var password = credentials.password;
var loginStorage = {};
var urnStorage = {};
var pendingUrns = 0;

var servicetoken;
var settings = {
    autodesk: {
      "version": "1.0",
      "consumer_key": credentials.credentials.oauth_id,
      "consumer_secret": credentials.credentials.oauth_secret,
      "arg_prefix": "oauth_",
      // authentication
      "requestToken": {
        "url": "https://accounts-staging.autodesk.com/OAuth/RequestToken",
        "arg": ["consumer_key"]
      },
      "authorize": {
        "url": "https://accounts-staging.autodesk.com/oauth/authorize"
      },
      "accessToken": {
        "key": "request_token_secret",
        "url": "https://accounts-staging.autodesk.com/OAuth/AccessToken",
        "arg": ["consumer_key", {"request_token":"oauth_token"}, "oauth_verifier"]
      }
    }
  };

var passport = require('passport');
var OAuth1Strategy = require('passport-oauth').OAuthStrategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use('oauth', new OAuth1Strategy({
    requestTokenURL: 'https://accounts-staging.autodesk.com/OAuth/RequestToken',
    accessTokenURL: 'https://accounts-staging.autodesk.com/OAuth/AccessToken',
    userAuthorizationURL: 'https://accounts-staging.autodesk.com/oauth/authorize',
    consumerKey: credentials.credentials.oauth_id,
    consumerSecret: credentials.credentials.oauth_secret,
    callbackURL: "http://bootcamp1.autodesk.com/api/verify"
  },
  function(token, tokenSecret, profile, done) {
  	getToken(token, tokenSecret, function(data) {
  		console.log("DATARECEIVED: ",data);
  		if(data.access_token && data.refresh_token && profile.username) {
		    loginStorage[data.refresh_token] = { access_token: data.access_token, username: profile.username, expiration: profile.expiration};
		    return done(null, encrypt(data.refresh_token));
	  	} else return done(null, 'temp');
  	});
  }
));

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}



var getToken = function(token, secret, callback) {
	var text = "client_id="+credentials.credentials.client_id+
						 "&client_secret="+credentials.credentials.client_secret+
						 "&oauth1_token="+token+
						 "&oauth1_secret="+secret;
	request({
	    url: 'https://developer-stg.api.autodesk.com/authentication/v1/exchange',
	    method: 'POST',
	    headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
	    body: text
		}, 
		function(error, response, body) {
      callback(JSON.parse(body));
    });
}



router.post('/save', function(req, res) {
	var data = '';
	req.on('data', function(d) {
		data+=d;
	});
	data = JSON.parse(data);
	console.log(data);
	req.on('end', function() {
		checkToken(req, function(userCode) {
			var username = loginStorage[userCode].username;
			var urn = data.urn;
			if(!urnStorage[username])
				urnStorage[username] = {};
			urnStorage[username][urn] = 'pending';
			console.log(urnStorage);
		}, function() {
			res.send(401, null);
		});
	});
});

router.get('/shared', function(req, res) {
	checkToken(req, function(userCode) {
		var urnArr = [];
		var username = loginStorage[userCode].username;
		for(key in urnStorage[username]) {
			if(urnStorage[username][key] !=- 'pending') {
				urnArr.push(key);
			}
		}
		res.send(200, JSON.stringify(urnArr));
	}, function() {
		res.send(401);
	});
});

router.get('/verify', passport.authenticate('oauth'),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/api/token');
  });

router.get('/oauth', passport.authenticate('oauth'));

router.get('/token', function(req, res) {
	userCode = 'invalid';
	if(req.session.passport.user) {
		userCode = decrypt(req.session.passport.user);
	}
	if(loginStorage[userCode]) {
		res.redirect('/');
	} else {
		res.redirect('/api/oauth');
	}
});

router.get('/readtoken', function(req, res) {
	//use service level tokens
	getTwoLegToken(function(token) {
		var body = { 
				access_token: token
		}
		loginStorage['common'] = {access_token: token, username: 'common'};
		return res.send(200, body);
	});
	return;
	//use personal tokens
	userCode = 'invalid';
	if(req.session.passport.user) {
		userCode = decrypt(req.session.passport.user);
		if(loginStorage[userCode]) {

			var body = { 
				access_token: loginStorage[userCode].access_token
			}
			return res.send(200, body);
		}
	} else {
		console.log('not found token', 404);
		res.send(404, null);
	}
});


module.exports = router;
