require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { ERROR_NOT_FOUND_STATUS_CODE, ERROR_INTERNAL_STATUS_CODE } = require('./utils/constants');
const cards = require('./routes/cards');
const users = require('./routes/users');

const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

const {
  PORT = 3000,
  MONGODB = 'mongodb://localhost:27017/mestodb',
} = process.env;

const options = {
  useNewUrlParser: true,
};

mongoose
  .connect(MONGODB, options)
  .catch((error) => {
    console.error(error);
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

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

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
