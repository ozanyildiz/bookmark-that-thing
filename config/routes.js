
var bookmarks = require('../controllers/bookmarks.js');
var users = require('../controllers/users.js');
var auth = require('./middlewares/authorization');

module.exports = function(app, passport) {

    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.get('/logout', users.logout);
    app.post('/users', users.create);

    app.post('/users/session',
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: 'Invalid email or password.'
        }), users.session);

    app.get('/auth/twitter',
    passport.authenticate('twitter', {
        failureRedirect: '/login'
    }), users.signin);

    app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
        failureRedirect: '/login'
    }), users.authCallback)

    app.get('/', bookmarks.show);

    app.get('/bookmarks', bookmarks.show);
    app.post('/bookmarks/create', auth.requiresLogin, bookmarks.create);
    app.del('/bookmarks/:id', bookmarks.destroy);
    app.put('/bookmarks/:id', bookmarks.update);
    app.get('/bookmarks/:tag', auth.requiresLogin, bookmarks.showTaggedBookmarks);
}