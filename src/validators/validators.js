import { body } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("⚠️ email is required!")
      .isEmail()
      .withMessage("🔴 email is invalid!"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("⚠️ username is required!")
      .isLowercase("⚠️ username must be in LOWERCASE")
      .isLength({ min: 3 })
      .withMessage("⚠️ username must be at least 3 characters long!"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("⚠️ password cannot be empty"),
    body("fullName")
      .optional()
      .trim()
      .isEmpty()
      .withMessage("⚠️ fullName cannot be empty"),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("⚠️ Email is invalid!"),
    body("password").notEmpty().withMessage("⚠️ Password is required"),
  ];
};

const passwordChangeValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("⚠️ Old password is required"),
    body("newPassword").notEmpty().withMessage("⚠️ New password is required!"),
  ];
};

const forgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("⚠️ Email is required")
      .isEmail()
      .withMessage("🔴 Email is invalid"),
  ];
};

const resetForgotPasswordValidator = () => {
  return [
    body("newPassword").notEmpty().withMessage("⚠️ Password is required!"),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  passwordChangeValidator,
  forgotPasswordValidator,
  resetForgotPasswordValidator,
};
