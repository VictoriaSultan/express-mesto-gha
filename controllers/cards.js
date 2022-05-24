const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log('createCard', error.name);
      if (error.name === 'ValidationError') {
        next({
          statusCode: 400,
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        next(error);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findOneAndDelete({
    _id: req.params.cardId,
    owner: req.user._id,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log('deleteCard', error.name);
      if (error.name === 'ValidationError') {
        next({
          statusCode: 404,
          message: 'Карточка с указанным _id не найдена',
        });
      } else if (error.name === 'CastError') {
        next({
          statusCode: 400,
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        next(error);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log('likeCard', error.name);
      if (error.name === 'ValidationError') {
        next({
          statusCode: 404,
          message: 'Передан несуществующий _id карточки',
        });
      } else if (error.name === 'CastError') {
        next({
          statusCode: 400,
          message: 'Переданы некорректные данные для постановки/снятии лайка',
        });
      } else {
        next(error);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log('dislikeCard', error.name);
      if (error.name === 'ValidationError') {
        next({
          statusCode: 404,
          message: 'Передан несуществующий _id карточки',
        });
      } else if (error.name === 'CastError') {
        next({
          statusCode: 400,
          message: 'Переданы некорректные данные для постановки/снятии лайка',
        });
      } else {
        next(error);
      }
    });
};
