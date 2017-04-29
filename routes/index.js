var express = require('express');
var router = express.Router();
var passport = require('passport');
var AdminModel = require('../models/AdminModel');
var account = require('../models/account');
var rubrique = require('../models/rubrique');
var profil = require('../models/profil');

//Acceder a la page d'acceuil
router.get('/', function(req, res, next) {
    if (req.user){
        var listeAccount = account.find(function (err, doc) {
            if (err) return console.log(err);
            res.render('index', {
                listeAccount : listeAccount,
                doc: doc,
                user : req.user,
            });

        })
    }else
        res.redirect('/login');

});

//Acceder a la page de connecxion
router.get('/login', function(req, res) {
    res.render('login', {
        user : req.user,
    });
});

//Poster les données et se connecter au compte
router.post('/login', passport.authenticate('local'), function(req, res) {
    console.log('Vous êtes connecté en tant que : ' + req.user.username);
    res.redirect('/');
});

// Decconexion du compte
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

//Suppression d'un compte
router.get('/deleteAccount', function (req, res) {
    if (req.user){
        profil.deleteOne({user: req.query.user}, function (err) {
            if (err) console.log('Erreur lors de la suppression du profil');
            console.log('Profil supprimé');
        })
        account.deleteOne({_id: req.query.id}, function (err) {
            if (err) console.log('Erreur lors de la suppression du compte');
            console.log('Utilisateur supprimé');
            res.redirect('/');
        })
    }else
        res.redirect('/login');

})

//Ajout d'un compte
router.post('/addAccount', function (req, res) {
    if (req.user){
        account.register(new account({ username : req.body.username}) ,req.body.password, function (err) {
            if (err) console.log('Erreur lors de le l ajout');
            console.log('Utilisateur ajouté');
            res.redirect('/');
        } )
    }else
        res.redirect('/login');

})

//Aller a la page contenu
router.get('/contenu', function (req, res) {
    if (req.user){
        var listeRubriques = rubrique.find(function (err, liste) {
            if (err) return console.log(err);
            res.render('contenu', {
                listeRubriques : listeRubriques,
                liste: liste,
                user : req.user,
            });
        })
    }else
        res.redirect('/login');
})

//Ajout d'un article
router.post('/addArticle', function (req, res) {
    if (req.user){
        rubrique.findOne({titre: req.body.nomRubrique}, function (err, doc) {
            doc.articles.push({
                titre: req.body.titreA,
                contenu: req.body.Contenu
            })
            doc.save(function (err) {
                if (err){
                    consore.error("******** Erreur lors de la sauvegarde de l article ********");
                }else {
                    console.log('******** Article ajouté ********');                }
                res.redirect('/contenu');
            })
        })
    }else
        res.redirect('/login');



})

//Supprimer article
router.get('/deleteArticle', function (req, res) {
    if (req.user){
        var id = req.query.id;
        rubrique.findOne({titre: req.query.titre}, function (err, doc) {
            doc.articles.id(id).remove();
            doc.save(function(){
                if (err) console.log('Erreur lors de la suppression');
                console.log('Article supprimé');
                res.redirect('/contenu');
            });
        })
    }else
        res.redirect('/login');

})

//Page de modification d'article
router.get('/editer', function (req, res) {
    if (req.user){
        console.log(req.query.titre);
        console.log(req.query.id);
        var id = req.query.id;
        rubrique.findOne({ titre : req.query.titre },function (err, rub) {
            res.render('editer', {
                art: rub.articles.id(id),
                user : req.user,
            });
        })
    }else
        res.redirect('/login');

})

//Modification d'article
router.post('/editer', function (req, res) {
    if (req.user){
        rubrique.findOne({ titre : req.query.titre },function (err, rub) {
            var id = req.query.id;
            var updatedArt = rub.articles.id(id);
            updatedArt.titre = req.body.titre;
            updatedArt.contenu = req.body.contenu;
            updatedArt.save(function (err) {
                if (err){
                    consore.error("******** Erreur lors de la sauvegarde ********");
                }else {
                    console.log('******** article Mis a jour ********');
                }
            });
            res.redirect('/contenu');
        })
    }else
        res.redirect('/login');

})

module.exports = router;
