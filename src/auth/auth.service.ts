import AppDataSource from "../typeOrm.config";
import { User } from "../user/entity/User.entity";
import { Repository } from "typeorm";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { RegisterDto } from "./dto/register.dto";
import { UserService } from "../user/user.service";
import { LoginDto } from "./dto/login.dto";
import { sanitizeUser } from "../utils/sanitize-user";
import { GetUserNoPassDto } from "./dto/get-user-no-pass.dto";
const userService = new UserService();
export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async register(
    dto: RegisterDto
  ): Promise<{ token: string; user: GetUserNoPassDto }> {
    const existingUser = await this.userRepository.findOneBy({
      email: dto.email,
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await userService.createUser({
      ...dto,
      password: hashedPassword,
    });

    const token = generateToken(user);

    return { token, user: sanitizeUser(user) };
  }

  async login(
    dto: LoginDto
  ): Promise<{ token: string; user: GetUserNoPassDto }> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email: dto.email })
      .getOne();

    if (!user) {
      throw new Error("User not found");
    }

    const isValid = await bcrypt.compare(dto.password, user.password);

    if (!isValid) {
      throw new Error("Invalid password");
    }

    const token = generateToken(user);
    return { token, user: sanitizeUser(user) };
  }
}
