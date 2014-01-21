
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

var bookmarkSchema = new Schema({
	url: String,
	tags: [String],
	notes: String,
	created_at: { type: Date, default: Date.now }
});

var Bookmark = mongoose.model('Bookmark', bookmarkSchema);

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
	var tags = req.body.inputTags.split(",");
	
	// Clean tag is the tag with no leading and ending spaces and also no more than one spaces!
	var cleanTags = [];
	var cleanTag = null;
	for (var i = 0; i < tags.length; i++) {
		cleanTag = tags[i].trim().replace(/ +/g, " ");
		if (cleanTag != "") { cleanTags.push(cleanTag); }
	}
	Bookmark.create({
		url: req.body.inputUrl,
		tags: cleanTags,
		notes: req.body.inputNotes
	}, function(err, bookmark) {
		if (err) { res.send(err); }

		Bookmark.find(function(err, bookmarks) {
			if (err) { res.send(err); }

			res.render('index', { bookmarks: bookmarks });
		});
	});
});

app.get('/:tag', function(req, res) {
	var tag = req.params.tag;
	var query = [{$unwind: "$tags"}, {$match: { tags: tag }}];

	Bookmark.aggregate(query, function(err, taggedBookmarks) {
		if (err) { res.send(err); }
		console.log("--------------------" + JSON.stringify(taggedBookmarks, null, 4));
		res.render('index', { bookmarks: taggedBookmarks });
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
