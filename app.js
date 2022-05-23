require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cards = require('./routes/cards');
const users = require('./routes/users');

const {
  PORT = 3000,
    MONGODB = 'mongodb://localhost:27017/mestodb',
} = process.env;

const options = {
  useNewUrlParser: true,
};

mongoose
  .connect(MONGODB, options)
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

mongoose.connection.on('error', (error) => {
  console.error(error);
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use('/', cards);
app.use('/', users);

app.use((req, res, next) => {
  req.user = {
    _id: '628a929948fa41ba37387c4e',
  };

  next();
});

app.use((err, req, res, next) => {
  const {
    statusCode = 500, message,
  } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'Внутренняя ошибка сервера' : message,
    });
  next();
});

app.get('*', (req, res) => {
  res
    .status(404)
    .send({
      message: 'Запрашиваемая страница не найдена',
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
