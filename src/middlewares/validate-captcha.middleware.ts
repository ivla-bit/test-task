import { Request, Response, NextFunction } from "express";
import { redisClient } from "../utils/cache";

export async function validateCaptchaMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.body);
    if (!req.body || !req.body.captchaKey || !req.body.captchaText) {
      return res.status(400).json({ message: "Captcha missing" });
    }

    const { captchaKey, captchaText } = req.body;
    console.log(captchaKey, captchaText);

    if (!captchaKey || !captchaText) {
      console.log("Captcha missing");
      return res.status(400).json({ message: "Captcha missing" });
    }

    const stored = await redisClient.get(captchaKey);

    if (!stored || stored.toLowerCase() !== captchaText.toLowerCase()) {
      return res.status(400).json({ message: "Invalid captcha" });
    }

    await redisClient.del(captchaKey);

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Captcha validation failed",
      error: (err as Error).message,
    });
  }
}
