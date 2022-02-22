const routerMovie = require('express').Router();
const {
  createMovie,
  getAllMovies,
  deletMovie,
} = require('../controllers/movies');

routerMovie.post('/', createMovie);
routerMovie.get('/', getAllMovies);
routerMovie.delete('/:_id', deletMovie);

module.exports = routerMovie;
