
var bookmarks = require('../controllers/bookmarks.js');

module.exports = function(app) {

    app.get('/', bookmarks.show);

    app.post('/save', bookmarks.save);

    app.get('/:tag', bookmarks.showTaggedBookmarks);
}