import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../user/entity/User.entity";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  content!: string;

  @ManyToOne(() => User, (user) => user.comments, {
    eager: true,
    onDelete: "CASCADE",
  })
  user!: User;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: "CASCADE",
  })
  parentComment!: Comment | null;

  @OneToMany(() => Comment, (comment) => comment.parentComment, {
    cascade: true,
  })
  replies!: Comment[];

  @Column({ nullable: true, type: "varchar" })
  filepath?: string;

  @Column({ nullable: true, type: "varchar" })
  fileType?: "image" | "text";

  @CreateDateColumn()
  createdAt!: Date;
}
