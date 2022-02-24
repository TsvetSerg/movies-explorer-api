const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const usersRout = require('./users');
const routerMovie = require('./movies');
const routerAuth = require('./authorization');
const authoriz = require('../middlewares/auth');

router.use(routerAuth);
router.use(authoriz);
router.use('/users', usersRout);
router.use('/movies', routerMovie);
router.all('*', (res, req, next) => {
  next(new NotFoundError('Ресурс не найден'));
});

module.exports = router;
