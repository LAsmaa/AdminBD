var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var article = new Schema({
    titre: String,
    contenu: String,
});

var rubrique = new Schema({
    titre:String,
    articles:[article]
});

module.exports = mongoose.model('rubrique', rubrique);
