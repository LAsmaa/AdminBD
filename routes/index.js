var express = require('express');
var router = express.Router();
var passport = require('passport');
var AdminModel = require('../models/AdminModel');
var account = require('../models/account');
var rubrique = require('../models/rubrique');
var profil = require('../models/profil');



// ================================//
// ********* Connexion *********** //
// ================================//

//Acceder a la page de connecxion ====================================> OK
router.get('/login', function(req, res) {
    res.render('login', {
        user : req.user,
    });
});

//Poster les données et se connecter au compte  ======================> OK
router.post('/login', passport.authenticate('local'), function(req, res) {
    console.log('Vous êtes connecté en tant que : ' + req.user.username);
    res.redirect('/');
});

// Decconexion du compte ==============================================> OK
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


// ========================================= //
// ********* Gestion du contenu ************ //
// ========================================= //

//Acceder a la page d'acceuil ========================================> OK
router.get('/', function(req, res, next) {
    if (req.user){
        var listeRubriques = rubrique.find(function (err, liste) {
            if (err) return console.log(err);
            res.render('index', {
                listeRubriques : listeRubriques,
                liste: liste,
                user : req.user,
            });
        })

    }else
        res.redirect('/login');

});



// ========================================= //
// ************** Rubriques **************** //
// ========================================= //

//Ajout d'une rubriue ===============================================> OK
router.post('/addRubrique', function (req, res) {
    if (req.user){
        var newRubrique = new rubrique({
            titre: req.body.titreRubrique
        });
        newRubrique.save(function (err) {
            if (err) console.log('Erreur lors de le l ajour de la rubrique');
            console.log('Rubrique utilisateur ajoutée');
        })
        res.redirect('/');
    }else
        res.redirect('/login');

})

//Suppression d'une rubrique ========================================> OK
router.get('/deleteRubrique', function (req, res) {
    if (req.user){
        rubrique.deleteOne({_id: req.query.id}, function (err) {
            if (err) console.log('Erreur lors de la suppression de la rubrique');
            console.log('Rubrique supprimée');
            res.redirect('/');
        })
    }else
        res.redirect('/login');

})

//Page de modification d'une rubrique ===============================> OK
router.post('/updateRubrique', function (req, res) {
    if (req.user){
        rubrique.findOne({_id:req.body.idRubrique}, function (err, doc) {
            doc.titre= req.body.NewTitre;
            doc.save(function (err) {
                if (err){
                    consore.error("******** Erreur lors de la sauvegarde ********");
                }else {
                    console.log('******** Rubrique Mise a jour ********');
                    res.redirect('/');
                }
            })
        })

    }else
        res.redirect('/login');

})


// ========================================= //
// *************** Articles **************** //
// ========================================= //

//Ajout d'un article  ================================================> OK
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
                res.redirect('/');
            })
        })
    }else
        res.redirect('/login');



})

//Supprimer article  =================================================> OK
router.get('/deleteArticle', function (req, res) {
    if (req.user){
        var id = req.query.id;
        rubrique.findOne({titre: req.query.titre}, function (err, doc) {
            doc.articles.id(id).remove();
            doc.save(function(){
                if (err) console.log('Erreur lors de la suppression');
                console.log('Article supprimé');
                res.redirect('/');
            });
        })
    }else
        res.redirect('/login');

})

//Modification d'article  ============================================> OK
router.post('/updateArticle', function (req, res) {
    if (req.user){

        var id = req.body.idArticle;
        rubrique.findOne({titre : req.body.titreRubrique }, function (err, doc) {

            doc.articles.id(id).remove();
            doc.articles.push({
                titre: req.body.titreA,
                contenu: req.body.Contenu
            })
            doc.save(function(){
                if (err) console.log('Erreur lors de la suppression');
                console.log('Article supprimé et autre ajouté');
                res.redirect('/');
            });
        })
    }else
        res.redirect('/login');

})


router.post('/register', function (req, res) {
    AdminModel.register(new account({ username : req.body.username}) ,req.body.password, function (err) {
            if (err) console.log('Erreur lors de le l ajout');
            console.log('Utilisateur ajouté');
            var newProfile = new profil({
                user    : req.body.username
            });
            newProfile.save(function (err) {
                if (err) console.log('Erreur lors de le l ajour du profil');
                console.log('Profil utilisateur ajouté');
            })
            res.redirect('/membres');
    })
})

router.get('/register', function (req, res) {
    res.render('register', { });
})


// ========================================= //
// ********* Gestion des comptes *********** //
// ========================================= //

//Aller a la page membres  ============================================> OK
router.get('/membres', function (req, res) {
    if (req.user){
        var listeAccount = account.find(function (err, doc) {
            if (err) return console.log(err);
            var listeProfils = profil.find(function (err, prof) {
                res.render('membres', {
                    listeAccount : listeAccount,
                    listeProfils: listeProfils,
                    doc: doc,
                    prof: prof,
                    user : req.user,
                });
            })
        })
    }else
        res.redirect('/login');
})

//Ajout d'un compte   =================================================> OK
router.post('/addAccount', function (req, res) {
    if (req.user){
        account.register(new account({ username : req.body.username}) ,req.body.password, function (err) {
            if (err) console.log('Erreur lors de le l ajout');
            console.log('Utilisateur ajouté');
            var newProfile = new profil({
                user    : req.body.username
            });
            newProfile.save(function (err) {
                if (err) console.log('Erreur lors de le l ajour du profil');
                console.log('Profil utilisateur ajouté');
            })
            res.redirect('/membres');
        } )
    }else
        res.redirect('/login');

})

//Suppression d'un compte  ============================================> OK
router.get('/deleteAccount', function (req, res) {
    if (req.user){
        profil.deleteOne({user: req.query.user}, function (err) {
            if (err) console.log('Erreur lors de la suppression du profil');
            console.log('Profil supprimé');
        })
        account.deleteOne({_id: req.query.id}, function (err) {
            if (err) console.log('Erreur lors de la suppression du compte');
            console.log('Utilisateur supprimé');
            res.redirect('/membres');
        })
    }else
        res.redirect('/login');

})

module.exports = router;
