import express from "express";
import { createServer } from "node:http"; //connect socket server and express server or express instance.
import mongoose from "mongoose";
import cors from "cors";
import { connectToSocket } from "./controllers/socketmanager.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({ limit: "40kb" })); //The limit option in express.json() restricts the maximum size of incoming JSON payloads. It prevents excessively large requests from being processed, improving security and performance.
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

const start = async () => {
  const connectDb = await mongoose.connect(
    "mongodb+srv://kunjtyagi045:kunjtyagi3392@cluster0.kp9ri.mongodb.net/"
  );
  console.log(`MONGO Connected DB Host: ${connectDb.connection.host}`);

  // Start the server and listen on the specified port
  server.listen(app.get("port"), () => {
    console.log("Server is running on port 8000");
  });
};

start();
