'use strict';

const SALT_WORK_FACTOR = 10;

const bcrypt   = require('bcrypt');
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const UserSchema = new Schema({
  username: {type: String, required: true, index: true, unique: true},
  password: {type: String, required: true},
  type:     String
}, {
  versionKey: false,
  collection: 'users',
  autoIndex: process.env.NODE_ENV !== 'production'
});


UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  })
});

UserSchema.methods.comparePassword = function (candidatePassword, next ) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) { return next(err); }

    next(null, isMatch);
  });
};

mongoose.model('User', UserSchema);
