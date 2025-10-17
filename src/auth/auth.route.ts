import { Router } from "express";

import { AuthController } from "./auth.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
const authRouter = Router();
const authController = new AuthController();

authRouter.post("/register", validationMiddleware(RegisterDto), (req, res) =>
  authController.register(req, res)
);
authRouter.post("/login", validationMiddleware(LoginDto), (req, res) =>
  authController.login(req, res)
);

export default authRouter;
