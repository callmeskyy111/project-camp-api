import { body } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("⚠️email is required!")
      .isEmail()
      .withMessage("🔴email is invalid!"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("⚠️username is required!")
      .isLowercase("⚠️username must be in LOWERCASE")
      .isLength({ min: 3 })
      .withMessage("⚠️username must be at least 3 characters long!"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("⚠️password cannot be empty"),
    body("fullName")
      .optional()
      .trim()
      .isEmpty()
      .withMessage("⚠️fullName cannot be empty"),
  ];
};

export { userRegisterValidator };
