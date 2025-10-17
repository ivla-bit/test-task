import multer from "multer";
export const parseFormMiddleware = multer({
  storage: multer.memoryStorage(),
}).single("file");
