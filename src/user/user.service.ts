import AppDataSource from "../typeOrm.config";
import { User } from "./entity/User.entity";
import { Repository } from "typeorm";

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    console.log(user);
    return await this.userRepository.save(user);
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }
  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }
}
