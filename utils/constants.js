/*

  400 — переданы некорректные данные в метод создания карточки, пользователя, обновления аватара
  пользователя и профиля;
  401 — передан неверный логин или пароль. Ещё эту ошибку возвращает авторизационный middleware,
  если передан неверный JWT;
  403 — попытка удалить чужую карточку;
  404 — карточка или пользователь не найден, или был запрошен несуществующий роут;
  409 — при регистрации указан email, который уже существует на сервере;
  500 — ошибка по умолчанию. Сопровождается сообщением: «На сервере произошла ошибка».

*/

const ERROR_WRONG_DATA_STATUS_CODE = 400;
const ERROR_UNAUTHORIZED_STATUS_CODE = 401;
const ERROR_FORBIDDEN_STATUS_CODE = 403;
const ERROR_NOT_FOUND_STATUS_CODE = 404;
const ERROR_CONFLICT_STATUS_CODE = 409;
const ERROR_INTERNAL_STATUS_CODE = 500;

module.exports = {
  ERROR_WRONG_DATA_STATUS_CODE,
  ERROR_UNAUTHORIZED_STATUS_CODE,
  ERROR_FORBIDDEN_STATUS_CODE,
  ERROR_NOT_FOUND_STATUS_CODE,
  ERROR_CONFLICT_STATUS_CODE,
  ERROR_INTERNAL_STATUS_CODE,
};
