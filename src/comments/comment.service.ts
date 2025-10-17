import AppDataSource from "../typeOrm.config";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Comment } from "./entity/comment.entity";
import { Repository } from "typeorm";
import { User } from "../user/entity/User.entity";
import { redisClient } from "../utils/cache";
import { commentEventEmitter, CommentEvents } from "../events/comment.events";
import { sanitizeCommentInput } from "../utils/sanitize-html";
import { SortField } from "../types/sort";
import { SortOrder } from "../types/sort";
export class CommentService {
  private commentRepository: Repository<Comment>;

  constructor() {
    this.commentRepository = AppDataSource.getRepository(Comment);
  }

  async create(dto: CreateCommentDto, user: User): Promise<Comment> {
    const sanitizedContent = sanitizeCommentInput(dto.content);

    const comment = this.commentRepository.create({
      content: sanitizedContent,
      filepath: dto.filepath,
      fileType: dto.fileType,
      user,
      parentComment: dto.parentId ? ({ id: dto.parentId } as Comment) : null,
    });
    let saved = await this.commentRepository.save(comment);

    if (dto.parentId) {
      const foundComment = await this.commentRepository.findOne({
        where: { id: saved.id },
        relations: ["parentComment", "parentComment.user"],
      });
      if (foundComment) {
        saved = foundComment;
      }
    }

    commentEventEmitter.emit(CommentEvents.CREATED, { comment: saved, user });
    console.log(saved);
    return saved;
  }

  async getRootComments(
    page: number = 1,
    limit: number = 25,
    sortField: SortField = "createdAt",
    sortOrder: SortOrder = "DESC"
  ): Promise<{ comments: Comment[]; totalPages: number }> {
    const cacheKey = `root_comments_tree_page_${page}_limit_${limit}_sort_${sortField}_${sortOrder}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) return JSON.parse(cachedData);

    const sortableFields = ["createdAt", "username", "email"] as const;
    if (!sortableFields.includes(sortField)) {
      sortField = "createdAt";
    }

    const qb = this.commentRepository
      .createQueryBuilder("comment")
      .leftJoinAndSelect("comment.user", "user")
      .where("comment.parentComment IS NULL")
      .skip((page - 1) * limit)
      .take(limit);

    if (sortField === "username" || sortField === "email") {
      qb.orderBy(`user.${sortField}`, sortOrder);
    } else {
      qb.orderBy(`comment.${sortField}`, sortOrder);
    }

    const [rootComments, totalCount] = await qb.getManyAndCount();

    const buildTree = async (comment: Comment): Promise<Comment> => {
      const replies = await this.commentRepository.find({
        where: { parentComment: { id: comment.id } },
        relations: ["user"],
        order: { createdAt: "ASC" },
      });

      comment.replies = await Promise.all(replies.map(buildTree));
      comment.content = sanitizeCommentInput(comment.content);
      return comment;
    };

    const fullTree = await Promise.all(rootComments.map(buildTree));
    const totalPages = Math.ceil(totalCount / limit);

    await redisClient.setEx(
      cacheKey,
      60,
      JSON.stringify({ comments: fullTree, totalPages })
    );

    return { comments: fullTree, totalPages };
  }

  async buildCommentTree(comment: Comment): Promise<Comment> {
    const replies = await this.commentRepository.find({
      where: { parentComment: { id: comment.id } },
      relations: ["user"],
      order: { createdAt: "ASC" },
    });

    comment.replies = await Promise.all(
      replies.map((r) => this.buildCommentTree(r))
    );

    comment.content = sanitizeCommentInput(comment.content);
    return comment;
  }

  async getCommentById(
    id: string,
    page: number = 1,
    limit: number = 25
  ): Promise<{ comment: Comment; totalPages: number } | null> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ["user"],
    });
    if (!comment) return null;

    const [replies, totalReplies] = await this.commentRepository.findAndCount({
      where: { parentComment: { id } },
      relations: ["user"],
      order: { createdAt: "ASC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    comment.replies = await Promise.all(
      replies.map((r) => this.buildCommentTree(r))
    );

    const totalPages = Math.ceil(totalReplies / limit);
    comment.content = sanitizeCommentInput(comment.content);

    return { comment, totalPages };
  }
}
