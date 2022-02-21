const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');
const { createUser, login } = require('./controllers/users');
const authoriz = require('./middlewares/auth');
const handelError = require('./middlewares/handelError');

const { PORT = 3000 } = process.env;
const app = express();
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.post('/signup', createUser);

app.post('/signin', login);

app.use(authoriz);

app.use(router);
app.use(express.json());

app.use(handelError);

app.listen(PORT);
