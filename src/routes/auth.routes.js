import { Router } from "express";
import {
  changeCurrentPassword,
  forgotPasswordRequest,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendEmailVerification,
  resetForgotPassword,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import {
  forgotPasswordValidator,
  passwordChangeValidator,
  resetForgotPasswordValidator,
  userLoginValidator,
  userRegisterValidator,
} from "../validators/validators.js";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

// express.Router()
const authRouter = Router();

// unsecured routes
authRouter.post("/register", userRegisterValidator(), validate, registerUser);
authRouter.post("/login", userLoginValidator(), validate, loginUser);
authRouter.get("/verify-email/:verificationToken", verifyEmail);
authRouter.post("/refresh-token", refreshAccessToken);
authRouter.post(
  "/forgot-password",
  forgotPasswordValidator(),
  validate,
  forgotPasswordRequest
);
authRouter.post(
  "/reset-password/:reset-token",
  resetForgotPasswordValidator(),
  validate,
  resetForgotPassword
);

// secured/protected routes
authRouter.post("/logout", verifyJWT, logoutUser);
authRouter.post("/current-user", verifyJWT, getCurrentUser);
authRouter.post(
  "/change-password",
  verifyJWT,
  passwordChangeValidator(),
  validate,
  changeCurrentPassword
);
authRouter.post(
  "/resend-email-verification",
  verifyJWT,
  resendEmailVerification
);

export default authRouter;
