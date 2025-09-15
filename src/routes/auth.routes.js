import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controllers.js";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../validators/validators.js";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", userRegisterValidator(), validate, registerUser);
authRouter.post("/login", userLoginValidator(), validate, loginUser);

// secure/protected routes
authRouter.post("/logout", verifyJWT, logoutUser);

export default authRouter;
