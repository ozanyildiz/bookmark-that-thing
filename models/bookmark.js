var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookmarkSchema = new Schema({
    url: String,
    user: { type : Schema.ObjectId, ref : 'User' },
    tags: [String],
    notes: String,
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);