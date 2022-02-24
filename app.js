require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const limiter = require('./method/limiter');
const router = require('./routes');
const handelError = require('./middlewares/handelError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  PORT = 3000,
  NODE_ENV,
  MONGO_URL,
} = process.env;

const app = express();
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/moviesdb', {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
// });

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

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(express.json());

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(handelError);
app.listen(PORT);
