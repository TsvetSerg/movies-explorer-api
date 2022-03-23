const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (e) => isURL(e),
      message: 'Не корректый URL.',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (e) => isURL(e),
      message: 'Не корректый URL.',
    },
  },
  thumbnail: {
    type: String,
    required: false,
    validate: {
      validator: (e) => isURL(e),
      message: 'Не корректый URL.',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
    index: true,
    unique: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movies', movieSchema);
