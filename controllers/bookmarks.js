var mongoose = require('mongoose');
var Bookmark = mongoose.model('Bookmark');
var request = require('request');

function renderIndexPageWithTags(req, res, bookmarks, isTagPage, tagsWithUrlNumbers) {
    res.render('bookmarks', { user: req.user, bookmarks: bookmarks, tagsWithUrlNumbers: tagsWithUrlNumbers, isTagPage: isTagPage });
}

function renderIndexPage(req, res, bookmarks, isTagPage, callback) {
    if (req.user) {
        var query = [{$match: { user: req.user._id }}, { $unwind: '$tags' }, { $group: { _id: '$tags', numberOfUrls: { $sum: 1 }}}];

        Bookmark.aggregate(query, function(err, tags) {
            if (err) { res.send(err); }
            callback(req, res, bookmarks, isTagPage, tags);
        });
    } else {
        callback(req, res);
    }
}

exports.create = function(req, res) {
    findTitleAndCreateBookmark(req, res, createBookmark);
}

function findTitleAndCreateBookmark(req, res, callback) {
    request(req.body.inputUrl, function (error, response, body) { // Be careful! There are two responses!
        if (!error && response.statusCode == 200) {
            title = body.match(/<title>(.*?)<\/title>/);
            callback(req, res, title[1]);
            // TODO set timeout
        }
    });
}

function createBookmark(req, res, title) {
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
        title: title,
        user: req.user,
        tags: cleanTags,
        notes: req.body.inputNotes
    }, function(err, bookmark) {
        if (err) { res.send(err); }

        res.redirect('/');
    });
}

exports.showTaggedBookmarks = function(req, res) {
    var tag = req.params.tag;
    var query = [{$match: { user: req.user._id }}, { $unwind: "$tags" }, { $match: { tags: tag }}];

    Bookmark.aggregate(query, function(err, taggedBookmarks) {
        if (err) { res.send(err); }
        renderIndexPage(req, res, taggedBookmarks, true, renderIndexPageWithTags);
    });
}

exports.show = function(req, res) {
    Bookmark.find({ user: req.user }, function(err, bookmarks) {
        if (err) { res.send(err); }
        renderIndexPage(req, res, bookmarks, false, renderIndexPageWithTags);
    });
}

exports.destroy = function(req, res) {
    var bookmarkId = req.params.id;

    Bookmark.findByIdAndRemove(bookmarkId, function(err) {
        if (err) { res.send(err); }
        res.redirect('/');
    });
}