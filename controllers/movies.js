const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const createMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner
  } = req.body;
  try {
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: req.user._id,
    });
    res.status(200).send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequest('Переданы некорректные данные.'));
    }
    next(err);
  }
};

const getAllMovies = async (req, res, next) => {
  try {
    const movie = await Movie.find({});
    res.status(200).send(movie);
  } catch (err) {
    next(err);
  }
};

const deletMovie = (req, res, next) => {
  const { _id } = req.params;
  Movie.findById(_id)
    .orFail(() => new Error('NotFound'))
    .then((movie) => {
      if (req.user._id.toString() === movie.owner.toString()) {
        movie.remove()
          .then(() => {
            res.status(200).send({ message: 'Фильм удален.' });
          })
          .catch(next);
      } else {
        throw new Error('AccessError');
      }
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError('Фильм по данному ID не найден.'));
      }
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные.'));
      }
      if (err.message === 'AccessError') {
        next(new ForbiddenError('Нельзя удалять чужой фильм.'));
      }
      next(err);
    });
};

module.exports = {
  createMovie,
  getAllMovies,
  deletMovie,
};
