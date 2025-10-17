import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @MaxLength(500, { message: "Content is too long" })
  content!: string;

  @IsOptional()
  parentId?: string;

  @IsOptional()
  filepath?: string;

  @IsOptional()
  fileType?: "image" | "text";
}
