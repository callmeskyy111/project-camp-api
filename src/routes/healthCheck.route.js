import { Router } from "express";
import { healthCheck } from "../controllers/healthCheck.controller.js";

const healthCheckRouter = Router();

healthCheckRouter.get("/", healthCheck);

export default healthCheckRouter;
