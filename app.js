
// module dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var config = require('./config/config');

var app = express();

mongoose.connect('mongodb://127.0.0.1/bookmark-store');

require('./models/user');
require('./models/bookmark');

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

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

require('./config/passport')(passport, config);

require('./config/routes')(app, passport);

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
