
var bookmarks = require('../controllers/bookmarks.js');
var users = require('../controllers/users.js');

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

    // app.get('/', bookmarks.show);

    // app.post('/save', bookmarks.save);

    // app.get('/:tag', bookmarks.showTaggedBookmarks);
}