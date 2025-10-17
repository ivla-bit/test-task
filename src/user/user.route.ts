import { Router } from "express";
import { UserController } from "./user.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { CreateUserDto } from "./dto/create-user.dto";

const userRouter = Router();

const userController = new UserController();

userRouter.post("/user", validationMiddleware(CreateUserDto), (req, res) =>
  userController.create(req, res)
);
userRouter.get("/user", (req, res) => userController.getAll(req, res));
userRouter.get("/user/:id", (req, res) => userController.getById(req, res));

export default userRouter;
