import fs from "fs";
import AppDataSource from "../typeOrm.config";
import { User } from "../user/entity/User.entity";
import { Comment } from "../comments/entity/comment.entity";
import { faker } from "@faker-js/faker";
import { AuthService } from "../auth/auth.service";
import { CommentService } from "../comments/comment.service";
import { connectRedis, redisClient } from "../utils/cache";

const authService = new AuthService();
const commentService = new CommentService();
const NUM_USERS = 10;
const NUM_COMMENTS = 100;

async function generate() {
  await AppDataSource.initialize();
  await connectRedis();
  const users: User[] = [];
  const comments: Comment[] = [];

  for (let i = 0; i < NUM_USERS; i++) {
    const user = new User();
    user.username = faker.internet.username().slice(0, 30);
    user.email = faker.internet.email();
    user.password = faker.internet.password({ length: 10 });
    user.homepage = Math.random() > 0.5 ? faker.internet.url() : undefined;
    users.push(user);
  }

  const rawData: any = { users: [], comments: [] };
  rawData.users = users.map((u) => ({
    username: u.username,
    password: u.password,
    email: u.email,
    homepage: u.homepage,
  }));

  for (let i = 0; i < NUM_COMMENTS; i++) {
    const comment = new Comment();
    comment.content = faker.lorem.sentence(5 + Math.floor(Math.random() * 15));

    const userIndex = Math.floor(Math.random() * NUM_USERS);
    comment.user = users[userIndex];

    if (comments.length > 0 && Math.random() > 0.5) {
      const parentIndex = Math.floor(Math.random() * comments.length);
      comment.parentComment = comments[parentIndex];
    } else {
      comment.parentComment = null;
    }

    if (Math.random() < 0.1) {
      comment.fileType = Math.random() > 0.5 ? "image" : "text";
      comment.filepath =
        comment.fileType === "image" ? "img/sample.png" : "files/sample.txt";
    }

    comments.push(comment);

    rawData.comments.push({
      content: comment.content,
      user: comment.user.username,
      parent: comment.parentComment ? comment.parentComment.content : null,
      filepath: comment.filepath,
      fileType: comment.fileType,
    });
  }

  fs.writeFileSync("data.json", JSON.stringify(rawData, null, 2));

  console.log("saving users...");
  for (const user of users) {
    await authService.register(user);
  }

  const userRepo = AppDataSource.getRepository(User);
  const savedUsers = await userRepo.find();

  console.log("saving comments...");
  for (const comment of comments) {
    const userIndex = Math.floor(Math.random() * savedUsers.length);
    comment.user = savedUsers[userIndex];
    await commentService.create(comment, comment.user);
  }
  console.log("Data generation complete.");
  await AppDataSource.destroy();
  await redisClient.quit();
}

generate().catch((error) => {
  console.error("Error during data generation:", error);
});
