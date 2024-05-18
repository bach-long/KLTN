const { check } = require("express-validator");

const validateRegisterUser = () => {
  return [
    check("username", "username không để trống").not().isEmpty(),
    check("username", "username phải là alphanumeric").isAlphanumeric(),
    check("username", "username dài ít nhất 6 ký tự").isLength({ min: 6 }),
    check("email", "Email không để trống").not().isEmpty(),
    check("email", "Phải là email").isEmail(),
    check("password", "password không để trống").not().isEmpty(),
    check("password", "password dài ít nhất 6 ký tự").isLength({ min: 6 }),
    check("confirm_password", "Confirm password không để trống")
      .not()
      .isEmpty(),
    check("confirm_password", "Confirm password dài ít nhất 6 ký tự").isLength({
      min: 6,
    }),
    check(
      "confirm_password",
      "Confirm password phải giống với password"
    ).custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm password không khớp với password");
      }
      return true;
    }),
  ];
};

const validateLogin = () => {
  return [
    check("username", "username không rỗng").not().isEmpty(),
    check("username", "username dài ít nhất 6 ký tự").isLength({ min: 6 }),
    check("password", "password dài ít nhất 6 ký tự").isLength({ min: 6 }),
  ];
};

let validate = {
  validateRegisterUser: validateRegisterUser,
  validateLogin: validateLogin,
};

module.exports = { validate };
