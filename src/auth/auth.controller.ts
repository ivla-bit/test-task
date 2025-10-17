import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const body = req.body;
      const result = await authService.register(body);
      res.status(201).json(result);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const body = req.body;
      const result = await authService.login(body);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
}
