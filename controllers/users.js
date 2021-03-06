var mongoose = require('mongoose');
var User = mongoose.model('User');
var utils = require('../lib/utils');

var login = function (req, res) {
    var redirectTo = req.session.returnTo ? req.session.returnTo : '/';
    delete req.session.returnTo;
    res.redirect(redirectTo);
}

exports.signin = function (req, res) {}

/**
 * Auth callback
 */

exports.authCallback = login;

/**
 * Show login form
 */

exports.login = function (req, res) {
    res.render('login', {
        title: 'Login',
        message: req.flash('error')
    });
}

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
    res.render('signup', {
        title: 'Sign up',
        user: new User()
    });
}

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/login');
}

exports.session = login;

exports.create = function (req, res) {
    var user = new User(req.body);
    user.provider = 'local';
    user.save(function (err) {
        if (err) {
            return res.render('signup', {
                errors: utils.errors(err.errors),
                user: user,
                title: 'Sign up'
            });
        }

        // manually login the user once successfully signed up
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/');
        })
    });
}

exports.show = function (req, res) {
    var user = req.profile;
    res.render('show', {
        title: user.name,
        user: user
    });
}

exports.user = function (req, res, next, id) {
    User.findOne({ _id : id })
        .exec(function (err, user) {
            if (err) { return next(err); }
            if (!user) { return next(new Error('Failed to load User ' + id)); }
            req.profile = user;
            next();
        });
}