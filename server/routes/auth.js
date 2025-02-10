const express = require('express');
const router = express.Router();
const authController = require('../controller/authController')
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', authController.signUp);
router.post('/login', authController.signIn);
router.post('/logout', verifyToken, authController.logout);


module.exports = router;