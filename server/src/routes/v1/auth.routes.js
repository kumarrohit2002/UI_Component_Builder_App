const express = require('express');
const router = express.Router();
const {registerUser,loginUser,logoutUser,isAuthenticated} = require('../../controllers/auth.controller');
const { authenticateToken } = require('../../middlewares');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/isAuthenticated',authenticateToken, isAuthenticated);

module.exports = router;