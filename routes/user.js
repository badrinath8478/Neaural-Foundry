const express = require("express");
const router = express.Router();
const AuthController = require("../controller/user");
const validator = require("../middleware/userValidator");

router.post("/register", validator.signUp(), validator.validate, AuthController.userRegister);
router.post("/login", validator.signIn(), validator.validate, AuthController.login);
router.post("/forgotPassword", validator.forgotPassword(), validator.validate, AuthController.forgotPassword);
router.post("/verifyOtp/:userId", validator.verifyOtp(), validator.validate, AuthController.verifyOtp);
router.post("/resendOtp", AuthController.resendOtp);
router.put("/resetPassword/:userId", validator.resetPassword(), validator.validate, AuthController.resetPassword);

module.exports = router;
