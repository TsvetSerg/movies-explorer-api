const routerUser = require('express').Router();
const {
  updateProfile,
  getProfile,
} = require('../controllers/users');

routerUser.get('/me', getProfile);
routerUser.patch('/me', updateProfile);

module.exports = routerUser;
