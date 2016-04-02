'use strict';

const config   = require('../config/config');
const mongoose = require('mongoose');
const glob     = require('glob');


mongoose.connect(config.db);
const db = mongoose.connection;
      db.on('error', function () {
        throw new Error('unable to connect to database at ' + config.db);
      });


const models = glob.sync(config.root + '/app/models/*.js');
      models.forEach(function (model) {
        require(model);
      });


const User     = mongoose.model('User');
const username = 'admin';
const password = 'admin';

new User({username, password})
  .save((err) => {
    if (err) { return console.log(err); }
    console.log('User Created');
  });
