import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function validationMiddleware<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.status(400).json({ message: "Body is required" });
    const dto = plainToClass(dtoClass, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }
    req.body = dto;
    console.log("DTO", dto);
    console.log("VALIDATE BODY", req.body);
    next();
  };
}
