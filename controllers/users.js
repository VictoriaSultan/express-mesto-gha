const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ERROR_WRONG_DATA_STATUS_CODE, ERROR_NOT_FOUND_STATUS_CODE } = require('../utils/constants');

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Email и пароль не могут быть пустыми' });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'wakanda-forever', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          httpOnly: true,
        })
        .send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка при запросе.' });
      } else if (err.message === 'NotFound') {
        res
          .status(404)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера.' });
      }
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((data) => {
      if (!data) {
        res
          .status(ERROR_NOT_FOUND_STATUS_CODE)
          .send({
            message: 'Пользователь по указанному _id не найден',
          });
      }
      res.send(data);
    })
    .catch((error) => {
      if (error.name === 'NotFound') {
        next({
          statusCode: ERROR_NOT_FOUND_STATUS_CODE,
          message: 'Пользователь по указанному _id не найден',
        });
      } else if (error.name === 'CastError') {
        next({
          statusCode: ERROR_WRONG_DATA_STATUS_CODE,
          message: 'Передано некорректное значение параметра _id',
        });
      } else {
        next(error);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (typeof avatar === 'undefined' || !validator.isEmail(email)) {
    next({
      statusCode: ERROR_WRONG_DATA_STATUS_CODE,
      message: 'Переданы некорректные данные при создании пользователя',
    });
  } else {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        if (error.name === 'ValidationError') {
          next({
            statusCode: ERROR_WRONG_DATA_STATUS_CODE,
            message: 'Переданы некорректные данные при создании пользователя',
          });
        } else {
          next(error);
        }
      });
  }
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next({
          statusCode: ERROR_NOT_FOUND_STATUS_CODE,
          message: 'Пользователь с указанным _id не найден',
        });
      } else if (error.name === 'ValidationError') {
        next({
          statusCode: ERROR_WRONG_DATA_STATUS_CODE,
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      } else {
        next(error);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next({
          statusCode: ERROR_NOT_FOUND_STATUS_CODE,
          message: 'Пользователь с указанным _id не найден',
        });
      } else if (error.name === 'ValidationError') {
        next({
          statusCode: ERROR_WRONG_DATA_STATUS_CODE,
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      } else {
        next(error);
      }
    });
};
