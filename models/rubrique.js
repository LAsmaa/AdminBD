var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var article = new Schema({
    titreArticle: String,
    contenu: String,
});

var rubrique = new Schema({
    titreRubrique:String,
    articles:[article]
});

module.exports = mongoose.model('rubrique', rubrique);
