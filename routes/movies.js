const routerMovie = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validUrl = require('../method/validUrl');
const {
  createMovie,
  getAllMovies,
  deletMovie,
} = require('../controllers/movies');

routerMovie.get('/', getAllMovies);

routerMovie.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required().min(2),
    duration: Joi.number().required().min(2),
    year: Joi.string().required().min(2),
    description: Joi.string().required().min(2),
    image: Joi.string().required().custom(validUrl),
    trailerLink: Joi.string().required().custom(validUrl),
    thumbnail: Joi.string().required().custom(validUrl),
    movieId: Joi.number().required().min(1),
    nameRU: Joi.string().required().min(2),
    nameEN: Joi.string().required().min(2),
  }),
}), createMovie);

routerMovie.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
  }),
}), deletMovie);

module.exports = routerMovie;
