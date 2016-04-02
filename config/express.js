'use strict';


const express        = require('express');
const glob           = require('glob');
const favicon        = require('serve-favicon');
const logger         = require('morgan');
const cookieParser   = require('cookie-parser');
const bodyParser     = require('body-parser');
const compress       = require('compression');
const methodOverride = require('method-override');
const session        = require('express-session');
const RedisStore     = require('connect-redis')(session);
const passport       = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const mongoose       = require('mongoose');


/**
 * Passport Authentication
 */

const User = mongoose.model('User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, done);
});

const strategy = new LocalStrategy((username, password, done) => {
  User.findOne({username}, (err, user) => {

    if (err)   { return done(err); }
    if (!user) { return done(null, false, {message: 'Invalid User'}); }

    user.comparePassword(password, (err, isMatch) => {
      if (err)     { return done(err); }
      if (isMatch) { return done(null, user); }
      return done(null, false, {mesage: 'Invalid Password'});
    });

  });
});

passport.use(strategy);



module.exports = function(app, config) {

  var env = process.env.NODE_ENV || 'development';
      app.locals.ENV = env;
      app.locals.ENV_DEVELOPMENT = env == 'development';


  app.disable('x-powered-by');
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');


  const sopts = {
    secret:           'gdealisthebestdeal',
    saveUninitialied: true,
    resave:           true,
    key:              'sid',
    cookie:           {httpOnly: true, maxAge: 259200000},
    store:            new RedisStore({prefix: 'session:', ttl: 10800})
  };

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());
  app.use(session(sopts));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req, res, next) => {

    //TODO: this should probably be in middlewares instead.
    if (!req.isAuthenticated) { return next(); }

    res.locals.user = req.user;
    res.locals.session = req.session;
    next();

  });


  const controllers = glob.sync(config.root + '/app/controllers/*.js');
        controllers.forEach(function (controller) {
          require(controller)(app);
        });



  app.use((req, res, next) => {
    var err    = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (app.get('env') === 'development') {
    app.use((err, req, res) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error:   err,
        title:   'error'
      });
    });
  }

  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error:   {},
      title:   'error'
    });
  });

};
