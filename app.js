require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cards = require('./routes/cards');
const users = require('./routes/users');

// const ERROR_WRONG_DATA_STATUS_CODE = 400;
const ERROR_NOT_FOUND_STATUS_CODE = 404;
const ERROR_INTERNAL_STATUS_CODE = 500;

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

app.use((req, res, next) => {
  req.user = {
    _id: '628a929948fa41ba37387c4e',
  };

  next();
});

app.use('/', cards);
app.use('/', users);

app.use('*', (req, res) => {
  res
    .status(ERROR_NOT_FOUND_STATUS_CODE)
    .send({
      message: 'Запрашиваемая страница не найдена',
    });
});

app.use((err, req, res, next) => {
  const {
    statusCode = ERROR_INTERNAL_STATUS_CODE, message,
  } = err;

  console.log('errorHandler', err);

  res
    .status(statusCode)
    .send({
      message: statusCode === ERROR_INTERNAL_STATUS_CODE ? 'На сервере произошла ошибка' : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
