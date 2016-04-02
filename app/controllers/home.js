'use strict';

const express = require('express');
const router  = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {

  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  res.render('index', {title: 'home'});
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});
