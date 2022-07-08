const express = require('express');
const app = express();
const router = express.Router();

const HomeController = require('../controllers/HomeController');
const UserController = require('../controllers/UserController');

const userAuth = require('../middleware/UserAuth');
const adminAuth = require('../middleware/AdminAuth');
const UserAuth = require('../middleware/UserAuth');

router.get('/', HomeController.index);

router.post('/auth', UserController.login);
router.get('/users/account/:id/all', userAuth, UserController.index);
router.get('/users/account/:id', userAuth, UserController.getById);
router.post('/create', UserController.create);
router.put('/users/account/:id/edit', userAuth, UserController.edit);
router.delete(
  '/users/account/:id/delete',
  userAuth,
  UserController.delete
);
router.get(
  '/users/account/:id/logout',
  userAuth,
  UserController.logout
);

module.exports = router;
