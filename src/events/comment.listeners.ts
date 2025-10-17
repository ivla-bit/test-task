import { commentEventEmitter, CommentEvents } from "./comment.events";
import { commentMailQueue } from "../queues/comment-mail.queue";
import { getIO } from "../sockets/socket";
import { redisClient } from "../utils/cache";

commentEventEmitter.on(CommentEvents.CREATED, async ({ comment, user }) => {
  if (
    comment.parentComment?.user?.email &&
    comment.parentComment.user.id !== user.id
  ) {
    try {
      const job = await commentMailQueue.add("sendEmail", {
        parentEmail: comment.parentComment.user.email,
        parentName: comment.parentComment.user.username,
        replyContent: comment.content,
        replyUser: user.username,
      });
      console.log("[comment.listeners] Enqueued email job", {
        jobId: job.id,
        parentEmail: comment.parentComment.user.email,
      });
    } catch (err: any) {
      console.error("[comment.listeners] Failed to enqueue email job", {
        err: err && err.message ? err.message : err,
      });
    }
  }

  const io = getIO();
  io.emit("new_comment", {
    id: comment.id,
    content: comment.content,
    user: { id: user.id, username: user.username, email: user.email },
    parentId: comment.parentComment?.id || null,
    filepath: comment.filepath,
    fileType: comment.fileType,
    createdAt: comment.createdAt,
    replies: comment.replies || [],
  });

  const keys = await redisClient.keys("root_comments_page_*");
  if (keys.length) {
    await Promise.all(keys.map((key) => redisClient.del(key)));
  }
});
