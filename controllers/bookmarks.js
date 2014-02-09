var mongoose = require('mongoose');
var Bookmark = mongoose.model('Bookmark');
var request = require('request');

function renderIndexPageWithTags(req, res, bookmarks, tagsWithUrlNumbers) {
    res.render('bookmarks', { user: req.user, bookmarks: bookmarks, tagsWithUrlNumbers: tagsWithUrlNumbers });
}

function renderIndexPage(req, res, bookmarks, callback) {
    if (req.user) {
        var query = [{$match: { user: req.user._id }}, { $unwind: '$tags' }, { $group: { _id: '$tags', numberOfUrls: { $sum: 1 }}}];

        Bookmark.aggregate(query, function(err, tags) {
            if (err) { res.send(err); }
            callback(req, res, bookmarks, tags);
        });
    } else {
        callback(req, res);
    }
}

exports.create = function(req, res) {
    var tags = req.body.inputTags.split(",");

    // Clean tag is the tag with no leading and ending spaces and also no more than one spaces!
    var cleanTags = [];
    var cleanTag = null;
    for (var i = 0; i < tags.length; i++) {
        cleanTag = tags[i].trim().replace(/ +/g, " ");
        if (cleanTag != "") { cleanTags.push(cleanTag); }
    }

    request(req.body.inputUrl, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            console.log(body);
        }
    });

    Bookmark.create({
        url: req.body.inputUrl,
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
        renderIndexPage(req, res, taggedBookmarks, renderIndexPageWithTags);
    });
}

exports.show = function(req, res) {
    Bookmark.find({ user: req.user }, function(err, bookmarks) {
        if (err) { res.send(err); }
        renderIndexPage(req, res, bookmarks, renderIndexPageWithTags);
    });
}