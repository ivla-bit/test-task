import { Router } from "express";
import { generateCaptcha } from "../middlewares/captcha.middleware";

const captchaRouter = Router();

captchaRouter.post("/generate", generateCaptcha);

export default captchaRouter;
