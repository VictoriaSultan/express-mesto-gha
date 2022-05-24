const User = require('../models/user');
const { ERROR_WRONG_DATA_STATUS_CODE, ERROR_NOT_FOUND_STATUS_CODE } = require('../utils/constants');

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
  } = req.body;
  if (typeof avatar === 'undefined') {
    next({
      statusCode: ERROR_WRONG_DATA_STATUS_CODE,
      message: 'Переданы некорректные данные при создании пользователя',
    });
  } else {
    User.create({ name, about, avatar })
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
