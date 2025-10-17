import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Request, Response } from "express";
import { SortField } from "../types/sort";
import { SortOrder } from "../types/sort";
const commentService = new CommentService();

export class CommentController {
  async create(req: Request, res: Response) {
    try {
      const dto: CreateCommentDto = req.body as CreateCommentDto;
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const comment = await commentService.create(dto, user);
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  async getRoot(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 25;
    const sortField = (req.query.sortField as SortField) || "createdAt";
    const sortOrder =
      (req.query.sortOrder as SortOrder)?.toUpperCase() === "ASC"
        ? "ASC"
        : "DESC";
    console.log(sortField, sortOrder);
    try {
      const data = await commentService.getRootComments(
        page,
        limit,
        sortField,
        sortOrder
      );
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const comment = await commentService.getCommentById(id);
      if (!comment)
        return res.status(404).json({ message: "Comment not found" });
      res.status(200).json(comment);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  }
}
