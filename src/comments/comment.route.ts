import { Router } from "express";
import { CommentController } from "./comment.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadFileMiddleware } from "../middlewares/upload-file.middleware";
import { validateCaptchaMiddleware } from "../middlewares/validate-captcha.middleware";
import { parseFormMiddleware } from "../middlewares/parse-form.middleware";

const commentRouter = Router();
const commentController = new CommentController();

commentRouter.post(
  "/comment",
  parseFormMiddleware,
  validateCaptchaMiddleware,
  authMiddleware,
  validationMiddleware(CreateCommentDto),
  uploadFileMiddleware,
  (req, res) => commentController.create(req, res)
);
commentRouter.get("/comments", (req, res) =>
  commentController.getRoot(req, res)
);
commentRouter.get("/comment/:id", (req, res) =>
  commentController.getById(req, res)
);

export default commentRouter;
