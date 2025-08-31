const express = require('express');
const { currentUser, loginUser, SignupUser, verifyEmail, requestVerificationEmail } = require('../controllers/userController');
const { validateHeaderName } = require('http');
const validateToken = require('../middleware/validateTokenHandelr');
const errorHandler = require('../middleware/errorHandler');
const verifyTokenMiddleware = require('../middleware/verifyTokenMiddleware');

const router = express.Router();



router.post("/signup" , SignupUser)

router.post("/login" ,loginUser)

router.get("/current" ,validateToken, currentUser)

router.get('/verify-email', verifyTokenMiddleware, verifyEmail)

router.post('/send-verification-email', requestVerificationEmail)

module.exports = router;