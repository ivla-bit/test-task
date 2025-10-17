import { Request, Response } from "express";
import svgCaptcha from "svg-captcha";
import { redisClient } from "../utils/cache";

export async function generateCaptcha(req: Request, res: Response) {
  const captcha = svgCaptcha.create({
    size: 6,
    ignoreChars: "0oO1ilI",
    noise: 3,
    color: true,
    background: "#cc9966",
  });

  const captchaKey = `captcha_${Date.now()}_${Math.random()}`;

  await redisClient.setEx(captchaKey, 300, captcha.text);

  res.json({
    svg: captcha.data,
    key: captchaKey,
  });
}
