const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const LoginError = require('../errors/LoginError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (e) => isEmail(e),
      message: 'Не корректый e-mail.',
    },
  },
});

userSchema.statics.findUserByCredentials = function validFunc({ email, password }) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new LoginError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new LoginError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('users', userSchema);
