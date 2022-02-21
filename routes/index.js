const router = require('express').Router();
// const NotFoundError = require('../errors/NotFoundError');
const usersRout = require('./users');
const routerMovie = require('./movies');

router.use('/users', usersRout);
router.use('/movies', routerMovie);
// router.all('*', (res, req, next) => {
//   next(new NotFoundError('Ресурс не найден'));
// });

module.exports = router;
