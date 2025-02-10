const express = require('express');
const router = express.Router();
const { verifyToken, refreshToken } = require('../middlewares/authMiddleware');
const userController = require('../controller/userController');

router.get('/user', verifyToken, userController.getUser);
router.get('/refresh', refreshToken, verifyToken, userController.getUser);
router.post('/user/update', refreshToken, verifyToken, userController.userUpdate);
router.get('/user/delete', verifyToken, userController.userDelete);

module.exports = router;