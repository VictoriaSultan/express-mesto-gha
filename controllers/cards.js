const Card = require('../models/card');
const {
  ERROR_WRONG_DATA_STATUS_CODE,
  ERROR_FORBIDDEN_STATUS_CODE,
  ERROR_NOT_FOUND_STATUS_CODE,
} = require('../utils/constants');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const {
    name,
    link,
  } = req.body;
  Card.create({
      name,
      link,
      owner: req.user._id,
    })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next({
          statusCode: ERROR_WRONG_DATA_STATUS_CODE,
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
      if (data) {
        if (req.user._id !== data.owner.toString()) {
          next({
            statusCode: ERROR_FORBIDDEN_STATUS_CODE,
            message: 'Чужую карточку нельзя удалить',
          });
        }
        data.remove();
        res.status(200)
          .send({
            message: `Карточка с id ${data.id} успешно удалена!`
          });
      } else {
        next({
          statusCode: ERROR_NOT_FOUND_STATUS_CODE,
          message: 'Карточка с указанным _id не найдена',
        });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next({
          statusCode: ERROR_NOT_FOUND_STATUS_CODE,
          message: 'Карточка с указанным _id не найдена',
        });
      } else if (error.name === 'CastError') {
        next({
          statusCode: ERROR_WRONG_DATA_STATUS_CODE,
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        next(error);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
      req.params.cardId, {
        $addToSet: {
          likes: req.user._id,
        }
      }, {
        new: true,
        runValidators: true,
      },
    )
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        next({
          statusCode: ERROR_NOT_FOUND_STATUS_CODE,
          message: 'Передан несуществующий _id карточки',
        });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next({
          statusCode: ERROR_NOT_FOUND_STATUS_CODE,
          message: 'Передан несуществующий _id карточки',
        });
      } else if (error.name === 'CastError') {
        next({
          statusCode: ERROR_WRONG_DATA_STATUS_CODE,
          message: 'Переданы некорректные данные для постановки/снятии лайка',
        });
      } else {
        next(error);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
      req.params.cardId, {
        $pull: {
          likes: req.user._id,
        }
      }, {
        new: true,
        runValidators: true,
      },
    )
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        next({
          statusCode: ERROR_NOT_FOUND_STATUS_CODE,
          message: 'Передан несуществующий _id карточки',
        });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next({
          statusCode: ERROR_NOT_FOUND_STATUS_CODE,
          message: 'Передан несуществующий _id карточки',
        });
      } else if (error.name === 'CastError') {
        next({
          statusCode: ERROR_WRONG_DATA_STATUS_CODE,
          message: 'Переданы некорректные данные для постановки/снятии лайка',
        });
      } else {
        next(error);
      }
    });
};
