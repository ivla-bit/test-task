import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import AppDataSource from "../typeOrm.config";
import { User } from "../user/entity/User.entity";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ id: decoded.id });
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  req.user = user;
  next();
}
