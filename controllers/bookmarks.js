var Bookmark = require('../models/bookmark.js');

function renderIndexPageWithTags(res, bookmarks, tagsWithUrlNumbers) {
    res.render('index', { bookmarks: bookmarks, tagsWithUrlNumbers: tagsWithUrlNumbers });
}

function renderIndexPage(res, bookmarks, callback) { // req might be added to parameters of this function
    var query = [{ $unwind: '$tags' }, { $group: { _id: '$tags', numberOfUrls: { $sum: 1 }}}];

    Bookmark.aggregate(query, function(err, tags) {
        if (err) { res.send(err); }
        callback(res, bookmarks, tags);
    });
}

exports.save = function(req, res) {
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

        res.redirect('/');
    });
}

exports.showTaggedBookmarks = function(req, res) {
    var tag = req.params.tag;
    var query = [{ $unwind: "$tags" }, { $match: { tags: tag }}];

    Bookmark.aggregate(query, function(err, taggedBookmarks) {
        if (err) { res.send(err); }
        renderIndexPage(res, taggedBookmarks, renderIndexPageWithTags);
    });
}

exports.show = function(req, res) {
    Bookmark.find(function(err, bookmarks) {
        if (err) { res.send(err); }
        renderIndexPage(res, bookmarks, renderIndexPageWithTags);
    });
}