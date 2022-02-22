const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const limiter = require('./method/limiter');
const router = require('./routes');
const { createUser, login } = require('./controllers/users');
const authoriz = require('./middlewares/auth');
const handelError = require('./middlewares/handelError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    res.send(200);
  }
  next();
});

app.use(limiter);
app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), login);

app.use(authoriz);

app.use(router);
app.use(express.json());

app.use(errorLogger);

app.use(errors());
app.use(handelError);

app.listen(PORT);
