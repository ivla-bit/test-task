import { DataSource } from "typeorm";
import { Comment } from "./comments/entity/comment.entity";
import { User } from "./user/entity/User.entity";
import dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [User, Comment],
  // Use TS migrations in development, JS migrations in production (after tsc build)
  migrations:
    process.env.NODE_ENV === "production"
      ? ["dist/migrations/*.js"]
      : ["migrations/*.ts"],
});

export default AppDataSource;
