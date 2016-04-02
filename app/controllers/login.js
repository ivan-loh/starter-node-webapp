'use strict';

const passport = require('passport');
const express  = require('express');
const router   = express.Router();


module.exports = function (app) {
  app.use('/login', router);
};


router.get('/', (req, res) => {

  if (req.isAuthenticated()) {
    res.redirect('/');
  }

  res.render('login');
});


router.post('/', (req, res, next) => {

  function handleAuth(err, user, info) {

    if (err) { return next(err); }
    if (!user) {
      return res.render('login', { message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) { return next(err); }

      // Setup The Session
      req.session.user = user;

      return res.redirect('/');
    });

  }

  passport
    .authenticate('local', handleAuth)(req, res, next);

});
