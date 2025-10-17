import { bucket } from "./firebase.initialize";
import { v4 as uuidv4 } from "uuid";

export async function uploadBufferToFirebase(
  buffer: Buffer,
  filename?: string
) {
  const destinationFileName = filename || `${uuidv4()}.dat`;
  const file = bucket.file(`uploads/${destinationFileName}`);
  await file.save(buffer, { contentType: "auto" });
  await file.makePublic();
  return file.publicUrl();
}
