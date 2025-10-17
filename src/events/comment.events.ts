import { EventEmitter } from "events";

export const commentEventEmitter = new EventEmitter();

export enum CommentEvents {
  CREATED = "comment_created",
  CACHE_INVALIDATE = "cache_invalidate",
}
