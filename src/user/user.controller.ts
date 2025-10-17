import { Request, Response } from "express";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";

const userService = new UserService();

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body as CreateUserDto);
      res.status(201).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to create user", details: error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await userService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve users" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve user" });
    }
  }
}
