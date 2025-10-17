import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./queues/comment-mail.queue";
import "./events/comment.listeners";
import userRouter from "./user/user.route";
import commentRouter from "./comments/comment.route";
import authRouter from "./auth/auth.route";
import captchaRouter from "./captcha/captcha.route";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRouter);

app.use("/api", authRouter);
app.use("/api", commentRouter);
app.use("/api", captchaRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

export default app;
