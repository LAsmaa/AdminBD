var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Importer mongoose package
var mongoose = require('mongoose');

//Importer parrport pour la connexion de l'administrateur
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;




var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Ajouter le path pour Ckeditor
app.use('/ckeditor',express.static(path.join(__dirname, './ckeditor')));

//Passport initialisation
app.use(passport.initialize());
app.use(passport.session());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


//Passport configuration
var AdminModel = require('./models/AdminModel');
passport.use(new LocalStrategy(AdminModel.authenticate()));
passport.serializeUser(AdminModel.serializeUser());
passport.deserializeUser(AdminModel.deserializeUser());



//Se connecter a notre base de données
mongoose.connect('mongodb://User:123123@ds151451.mlab.com:51451/equipe_de_recherche_bd'); //L'adresse de notre base de données
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error : '));
db.once('open',function(){
    console.log("We are connected"); //Message a transmettre si connexion réussie
})

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
