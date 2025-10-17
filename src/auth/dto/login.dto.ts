import { IsString, Length, IsEmail } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @IsString()
  @Length(8, 10, {
    message:
      "Password must be at least 8 characters long and maximum 10 characters",
  })
  password!: string;
}
