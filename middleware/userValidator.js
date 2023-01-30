const { body, validationResult } = require("express-validator");
const User = require("../model/user");

const signUp = () => {
    return [
        body("email")
            .notEmpty()
            .withMessage("email is required")
            .isEmail()
            .withMessage("valid email requried")
            .custom(async (email) => {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    throw new Error("Email already in exist try to login");
                }
            }),
        body("password")
            .notEmpty()
            .withMessage("password is required")
            .isLength({ min: 8 })
            .withMessage("password minimum 8 characters")
            .isLength({ max: 100 })
            .withMessage("password maximum 100 characters")
            .matches(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[.,'!&$%@])[0-9a-zA-Z .,!&$%@]{8,}$/,
                "i"
            )
            .withMessage(
                "Password should be alphanumeric and contain atleast one special character mention here .,!&$%@"
            ),
        body("Name")
            .notEmpty()
            .withMessage("User Name is required")
            .isLength({ min: 3 })
            .withMessage("User Name minimum 3 characters")
            .isLength({ max: 50 })
            .withMessage("User Name maximum 50 characters"),
    ];
};

const signIn = () => {
    return [
        body("email")
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("valid email requried"),
        body("password")
            .notEmpty()
            .withMessage("password is required")
            .isLength({ min: 8 })
            .withMessage("password minimum 8 characters")
            .isLength({ max: 100 })
            .withMessage("password maximum 100 characters"),
    ];
};

const verifyOtp = () => {
    return [
        body("otp")
            .notEmpty()
            .withMessage("OTP is required")
            .isNumeric()
            .withMessage("OTP should be Number")
            .isLength({ min: 6, max: 6 })
            .withMessage("OTP reuqires 6 digits"),
    ];
};

const forgotPassword = () => {
    return [
        body("email")
            .notEmpty()
            .withMessage("email is required")
            .isEmail()
            .withMessage("valid email requried"),
    ];
};

const resetPassword = () => {
    return [
        body("password")
            .notEmpty()
            .withMessage("password is required")
            .isLength({ min: 8 })
            .withMessage("password minimum 8 characters")
            .isLength({ max: 100 })
            .withMessage("password maximum 100 characters")
            .matches(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[.,'!&$%@])[0-9a-zA-Z .,!&$%@]{8,}$/,
                "i"
            )
            .withMessage(
                "Password should be alphanumeric and contain atleast one special character mention here .,!&$%@"
            ),
    ];
};

const validate = (req, res, next) => {
    const error = validationResult(req);
    if (error.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    error.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
        error: extractedErrors,
    });
};

module.exports = {
    signUp,
    validate,
    signIn,
    verifyOtp,
    forgotPassword,
    resetPassword,
};
