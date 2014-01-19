
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://127.0.0.1/bookmark-store');

// all environments
app.set('port', process.env.PORT || 3030);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.bodyParser());
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var Bookmark = mongoose.model('Bookmark', {
	url: String,
	tags: String,
	notes: String
});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {
	Bookmark.find(function(err, bookmarks) {
		if (err) { res.send(err); }
		res.render('index', { bookmarks: bookmarks });
	});
});

app.post('/', function(req, res) {
	Bookmark.create({
		url: req.body.inputUrl,
		tags: req.body.inputTags,
		notes: req.body.inputNotes
	}, function(err, bookmark) {
		if (err) { res.send(err); }

		Bookmark.find(function(err, bookmarks) {
			if (err) { res.send(err); }

			res.render('index', { bookmarks: bookmarks });
		});
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
