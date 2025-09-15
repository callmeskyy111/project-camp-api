import { Router } from "express";
import { registerUser } from "../controllers/auth.controllers.js";
import { userRegisterValidator } from "../validators/validators.js";
import { validate } from "../middlewares/validator.middleware.js";

const authRouter = Router();

authRouter.post("/register", userRegisterValidator(), validate, registerUser);

export default authRouter;
