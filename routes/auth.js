const express = require("express");
const verifySignUp = require('../middlewares/verifySignUp');
const AuthCtrl = require('../controllers/Auth.controller');

const router = express.Router();

router.post('/register', [verifySignUp.checkDuplicateUserNameOrEmail], AuthCtrl.signUp);
router.post('/login', AuthCtrl.signIn);
router.post('/forgot-pw', AuthCtrl.forgot_pw);
router.put('/:id', AuthCtrl.reset_pw);

module.exports = router;