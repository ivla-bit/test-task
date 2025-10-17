import sharp from "sharp";
import { uploadBufferToFirebase } from "../firebase/firebase.storage";
import { Request, Response, NextFunction } from "express";

export async function uploadFileMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) return next();

    const buffer = req.file.buffer;
    const mimetype = req.file.mimetype;
    const originalname = req.file.originalname;

    let processedBuffer = buffer;

    if (mimetype.startsWith("image/")) {
      const image = sharp(buffer);
      const metadata = await image.metadata();
      const maxWidth = 320;
      const maxHeight = 240;

      if (metadata.width && metadata.height) {
        if (metadata.width > maxWidth || metadata.height > maxHeight) {
          processedBuffer = await image
            .resize({ width: maxWidth, height: maxHeight, fit: "inside" })
            .toBuffer();
        }
      }

      const url = await uploadBufferToFirebase(processedBuffer, originalname);

      req.body.filepath = url;
      req.body.fileType = "image";
    } else if (mimetype === "text/plain") {
      if (req.file.size > 100 * 1024) {
        return res.status(400).json({ message: "Text file exceeds 100kb" });
      }

      const url = await uploadBufferToFirebase(buffer, originalname);

      req.body.filepath = url;
      req.body.fileType = "text";
    } else {
      return res.status(400).json({ message: "Invalid file type" });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "File processing failed",
      error: (error as Error).message,
    });
  }
}
