import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
} from "class-validator";

export class GetUserNoPassDto {
  @IsString()
  @Length(3, 50, { message: "Username must be between 3 and 50 characters" })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: "Username can contain only letters and numbers",
  })
  username!: string;

  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @IsOptional()
  @IsUrl({}, { message: "Invalid URL" })
  homepage?: string;
}
