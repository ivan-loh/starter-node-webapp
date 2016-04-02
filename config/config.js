'use strict';

const path     = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env      = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'gdeal-inventory'
    },
    port: 3000,
    db: 'mongodb://localhost/gdeal-inventory-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'gdeal-inventory'
    },
    port: 3000,
    db: 'mongodb://localhost/gdeal-inventory-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'gdeal-inventory'
    },
    port: 3000,
    db: 'mongodb://localhost/gdeal-inventory-production'
  }
};

module.exports = config[env];
