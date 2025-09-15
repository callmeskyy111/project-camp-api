import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controllers.js";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../validators/validators.js";
import { validate } from "../middlewares/validator.middleware.js";

const authRouter = Router();

authRouter.post("/register", userRegisterValidator(), validate, registerUser);
authRouter.post("/login", userLoginValidator(), validate, loginUser);

export default authRouter;
