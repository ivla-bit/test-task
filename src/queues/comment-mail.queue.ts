import { Queue, Worker } from "bullmq";
import ioredis from "ioredis";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const connection = new ioredis({
  host: process.env.REDIS_HOST || "redis",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
});

export const commentMailQueue = new Queue("commentMail", {
  connection,
});

new Worker(
  "commentMail",
  async (job) => {
    const { parentEmail, parentName, replyContent, replyUser } = job.data;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `test-task <${process.env.SMTP_USER}>`,
      to: parentEmail,
      subject: "New reply to your comment",
      text: `Hello ${parentName},\n\n${replyUser} replied to your comment:\n\n"${replyContent}"\n\nBest regards,\ntest-task`,
    });
    console.log("EMEAIL_SENT");
  },
  { connection }
);
