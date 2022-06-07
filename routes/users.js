const router = require('express').Router();
const {
  getUsers,
  getUser,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.get('/users/me', getCurrentUser);
router.patch('/users/me', updateUserProfile);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
