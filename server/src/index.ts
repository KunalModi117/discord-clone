import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import serverRoutes from "./routes/server";
import channelRoutes from "./routes/channel";
import messageRoutes from "./routes/message";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.set("io", io);

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("join", (channelId) => {
    socket.join(channelId);
    console.log(`🟡 Socket ${socket.id} joined channel ${channelId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

app.use("/", messageRoutes);
app.use("/", channelRoutes);
app.use("/servers", serverRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
