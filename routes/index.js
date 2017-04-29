var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('Toujours connecté en tant que : '+ req.user.username);
  res.render('index', {
      user : req.user,
      title: 'Express' });
});

// Accedrer a la page de création d'un nouveu compte
router.get('/register', function(req, res) {
    res.render('register', {
        user : req.user,
    });
});

// Poster le nouveu compte
router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', {
                account : account,
                user : req.user,
            });
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
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

module.exports = router;
