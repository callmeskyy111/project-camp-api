import { Router } from "express";
import {
  forgotPasswordRequest,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resetForgotPassword,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import {
  forgotPasswordValidator,
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

export default authRouter;
