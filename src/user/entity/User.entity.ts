import { IsEmail, IsUrl, Length, Matches } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Comment } from "../../comments/entity/comment.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  @Length(3, 30, { message: "Name must be between 3 and 30 characters" })
  @Matches(/^[A-Za-z0-9]+$/, {
    message: "Name can only contain letters and numbers",
  })
  username!: string;

  @Column({ type: "varchar", select: false })
  @Length(6, 10, { message: "Password must be between 6 and 10 characters" })
  password!: string;

  @Column({ type: "varchar" })
  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @Column({ type: "varchar", nullable: true })
  @IsUrl({}, { message: "Invalid URL format" })
  homepage?: string;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];

  @CreateDateColumn()
  createdAt!: Date;
}
