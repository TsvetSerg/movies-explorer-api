const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const BadRequest = require('../errors/BadRequest');
const LoginError = require('../errors/LoginError');
const NotFoundError = require('../errors/NotFoundError');

const { JWT_SECRET = 'VERY_SECRET_JWT' } = process.env;

const createUser = (req, res, next) => {
  const { name, email } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then(() => res.status(200).send({ name, email }))
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Введены некорректные данные!'));
      } else {
        next(err);
      }
    });
};

// Обновление профия
const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    );
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequest('Переданы некорректные данные при обновлении профиля.'));
    } else if (err.name === 'MongoServerError' && err.code === 11000) {
      next(new ConflictError('Пользователь с данным email уже существует'));
    } else {
      next(err);
    }
  }
};

const getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('Данный id не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new LoginError('передан неверный логин или пароль.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  updateProfile,
  getProfile,
  login,
};
