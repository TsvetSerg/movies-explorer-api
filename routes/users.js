const routerUser = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateProfile,
  getProfile,
} = require('../controllers/users');

routerUser.get('/me', getProfile);
routerUser.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateProfile);

module.exports = routerUser;
