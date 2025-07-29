import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken"; 
import { parse } from "cookie";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import serverRoutes from "./routes/server";
import channelRoutes from "./routes/channel";
import messageRoutes from "./routes/message";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
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

  const cookies = parse(socket.handshake.headers.cookie || "");
  const token = cookies.token;

  try {
    if (token) {
      const decoded: any = verify(token, process.env.JWT_SECRET!);
      (socket as any).userId = decoded.userId;
      console.log("🔐 Authenticated user:", decoded.userId);
    } else {
      console.log("❌ No auth token provided");
    }
  } catch (err) {
    console.log("❌ Invalid token", err);
  }

  socket.on("join", (channelId) => {
    socket.join(channelId);
    console.log(`🟡 Socket ${socket.id} joined channel ${channelId}`);
  });

  socket.on("leave", (channelId) => {
    socket.leave(channelId);
    console.log(`🔵 Socket ${socket.id} left channel ${channelId}`);
  });

  socket.on("message:send", async ({ content, channelId }) => {
    try {
      const userId = (socket as any).userId;
      if (!userId) return;

      const saved = await prisma.message.create({
        data: {
          content,
          channelId,
          userId,
        },
        include: {
          user: true,
        },
      });

      io.to(channelId).emit("message:new", saved);
      console.log(`📨 Message sent in ${channelId}:`, content);
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

app.use(cookieParser());
app.use("/", messageRoutes);
app.use("/", channelRoutes);
app.use("/servers", serverRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);

server.listen(5000, () => {
  console.log("Backend + Socket.IO running on http://localhost:5000");
});
