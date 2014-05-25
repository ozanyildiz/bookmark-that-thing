var mongoose = require('mongoose');
var Bookmark = mongoose.model('Bookmark');
var request = require('request');

function getCleanTags(inputTags) {
    var tags = inputTags.split(",");

    // Clean tag is the tag with no leading and ending spaces and also no more than one spaces!
    var cleanTags = [];
    var cleanTag = null;
    for (var i = 0; i < tags.length; i++) {
        cleanTag = tags[i].trim().replace(/ +/g, " ");
        if (cleanTag != "") { cleanTags.push(cleanTag); }
    }

    return cleanTags;
}

function renderIndexPageWithTags(req, res, bookmarks, isTagPage, tagsWithUrlNumbers) {
    res.render('bookmarks', { user: req.user, bookmarks: bookmarks, tagsWithUrlNumbers: tagsWithUrlNumbers, isTagPage: isTagPage, message: req.flash('success') });
}

function renderIndexPage(req, res, bookmarks, isTagPage, callback) {
    if (req.user) {
        var query = [{ $match: { user: req.user._id }}, { $unwind: '$tags' }, { $group: { _id: '$tags', numberOfUrls: { $sum: 1 }}}];
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
            if (title != null && title[1] != null) {
                callback(req, res, title[1]);
                // TODO set timeout
            } else {
                callback(req, res, req.body.inputUrl);
            }
        }
    });
}

function createBookmark(req, res, title) {
    var cleanTags = getCleanTags(req.body.inputTags);

    Bookmark.create({
        url: req.body.inputUrl,
        title: title,
        user: req.user,
        tags: cleanTags,
        notes: req.body.inputNotes
    }, function(err, bookmark) {
        if (err) { res.send(err); }
        req.flash('success', 'Bookmark has been sucessfully created!');
        res.redirect('/');
    });
}

exports.showTaggedBookmarks = function(req, res) {
    var tag = req.params.tag;
    var query = [{$match: { user: req.user._id }}, { $unwind: "$tags" }, { $match: { tags: tag }}, { $sort: { created_at: -1 }}];

    Bookmark.aggregate(query, function(err, taggedBookmarks) {
        if (err) { res.send(err); }
        renderIndexPage(req, res, taggedBookmarks, true, renderIndexPageWithTags);
    });
}

exports.show = function(req, res) {
    Bookmark.find({ user: req.user }, null, { sort: { created_at: -1 }}, function(err, bookmarks) {
        if (err) { res.send(err); }
        renderIndexPage(req, res, bookmarks, false, renderIndexPageWithTags);
    });
}

exports.destroy = function(req, res) {
    var bookmarkId = req.params.id;

    Bookmark.findByIdAndRemove(bookmarkId, function(err) {
        if (err) { res.send(err); }
        req.flash('success', 'Bookmark has been sucessfully removed!');
        res.redirect('/');
    });
}

exports.update = function(req, res) {
    var bookmarkId = req.params.id;

    var cleanTags = getCleanTags(req.body.inputTags);

    Bookmark.findByIdAndUpdate(bookmarkId, {
        title: req.body.inputTitle,
        tags: cleanTags,
        notes: req.body.inputNotes
    }, function(err) {
        if (err) { res.send(err); }
        req.flash('success', 'Bookmark has been sucessfully edited!');
        res.redirect('/');
    });

}
