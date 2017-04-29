
// models/profil.ejs

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var article = new Schema({
    titre: String,
    date: String,
    contenu: String
});

var rubrique = new Schema({
    titre:String,
    articles:[article]
});

var profil = new Schema({
    user: String,
    nom: String,
    img: String,
    pres: String,
    grade: String,
    email: String,
    bureau: String,
    rubriques: [rubrique]
});



module.exports = mongoose.model('profil', profil);


