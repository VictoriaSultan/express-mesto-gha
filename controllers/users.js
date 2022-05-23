const User = require('../models/user');

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
      res.send(data);
    })
    .catch((error) => {
      console.log('getUser', error.name);
      if (error.name === 'NotFound') {
        next({
          statusCode: 404,
          message: 'Пользователь по указанному _id не найден',
        });
      } else if (error.name === 'CastError') {
        next({
          statusCode: 400,
          message: 'Передано некорректное значение параметра _id',
        });
      } else {
        next(error);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({
    name,
    about,
    avatar,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log('createUser', error.name);
      if (error.name === 'ValidationError') {
        next({
          statusCode: 400,
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } else {
        next(error);
      }
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
    },
  )
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log('updateUserProfile', error.name);
      if (error.name === 'CastError') {
        next({
          statusCode: 404,
          message: 'Пользователь с указанным _id не найден',
        });
      } else if (error.name === 'ValidationError') {
        next({
          statusCode: 400,
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      } else {
        next(error);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
    },
  )
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log('updateUserAvatar', error.name);
      if (error.name === 'CastError') {
        next({
          statusCode: 404,
          message: 'Пользователь с указанным _id не найден',
        });
      } else if (error.name === 'ValidationError') {
        next({
          statusCode: 400,
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      } else {
        next(error);
      }
    });
};
