import admin from "firebase-admin";
import serviceAccount from "../configs/firebase.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: "gs://test-task-b6e22.firebasestorage.app",
});

export const bucket = admin.storage().bucket();
