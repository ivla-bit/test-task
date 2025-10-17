import "reflect-metadata";
import app from "./app.js";
import http from "http";
import dotenv from "dotenv";
import AppDataSource from "./typeOrm.config";
import { connectRedis } from "./utils/cache";
import { initSocket } from "./sockets/socket";

dotenv.config();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(() => {
    console.log("data source initialized");
  })
  .catch((error) => console.log(error));

initSocket(server);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectRedis().then(() => {
  console.log("Redis connected");
});
