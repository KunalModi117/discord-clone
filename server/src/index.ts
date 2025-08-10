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
const PORT = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.set("io", io);

const onlineUsers = new Map<string, { socketId: string; status: string }>();
const socketToUserMap = new Map<string, string>();

io.on("connection", async (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  const cookies = parse(socket.handshake.headers.cookie || "");
  const token = cookies.token;
  let userId: string | null = null;

  try {
    if (token) {
      const decoded: any = verify(token, process.env.JWT_SECRET!);
      userId = decoded.userId;
      (socket as any).userId = userId;
      console.log("🔐 Authenticated user:", userId);

      if (userId) {
        onlineUsers.set(userId, { socketId: socket.id, status: "online" });
        socketToUserMap.set(socket.id, userId);

        io.emit("user:status", { userId, status: "online" });
        console.log(`✅ User ${userId} is now online.`);

        const currentStatuses: Record<string, string> = {};
        onlineUsers.forEach((value, key) => {
          currentStatuses[key] = value.status;
        });
        socket.emit("current:statuses", currentStatuses);
        console.log(`➡️ Sent current statuses to ${socket.id}`);
      }
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

  socket.on(
    "message:send",
    async ({ content, channelId, tempId, type = "TEXT" }) => {
      try {
        const currentUserId = (socket as any).userId;
        if (!currentUserId) return;

        const saved = await prisma.message.create({
          data: {
            content,
            channelId,
            userId: currentUserId,
            type,
          },
          include: {
            user: true,
          },
        });

        io.to(channelId).emit("message:new", { ...saved, tempId });
        console.log(`📨 Message sent in ${channelId}:`, content);
      } catch (err) {
        console.error("❌ Error sending message:", err);
      }
    }
  );

  socket.on("typing:start", ({ channelId }) => {
    const currentUserId = (socket as any).userId;
    if (!currentUserId) return;
    if (
      onlineUsers.has(currentUserId) &&
      onlineUsers.get(currentUserId)?.status === "online"
    ) {
      socket.to(channelId).emit("typing:started", { userId: currentUserId });
    }
  });

  socket.on("typing:stop", ({ channelId }) => {
    const currentUserId = (socket as any).userId;
    if (!currentUserId) return;
    if (
      onlineUsers.has(currentUserId) &&
      onlineUsers.get(currentUserId)?.status === "online"
    ) {
      socket.to(channelId).emit("typing:stopped", { userId: currentUserId });
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
    const disconnectedUserId = socketToUserMap.get(socket.id);

    if (disconnectedUserId) {
      onlineUsers.delete(disconnectedUserId);
      socketToUserMap.delete(socket.id);
      io.emit("user:status", { userId: disconnectedUserId, status: "offline" });
      console.log(`🚫 User ${disconnectedUserId} is now offline.`);
    }
  });
});

app.use(cookieParser());
app.use("/", messageRoutes);
app.use("/", channelRoutes);
app.use("/servers", serverRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);

server.listen(PORT, () => {
  console.log(`Backend + Socket.IO running on ${PORT}`);
});