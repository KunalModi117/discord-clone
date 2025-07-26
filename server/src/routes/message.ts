import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth";
import { Server } from "socket.io";
import { Event } from "../../utils/enum";

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  "/channels/:channelId/messages",
  authenticateToken,
  async (req, res): Promise<any> => {
    const userId = req?.userId;
    const { channelId } = req.params;
    const { content } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!content)
      return res.status(400).json({ error: "Message content required" });

    try {
      const channel = await prisma.channel.findUnique({
        where: { id: channelId },
        include: { server: true },
      });

      if (!channel) return res.status(404).json({ error: "Channel not found" });
      const isMember = await prisma.member.findFirst({
        where: {
          userId,
          serverId: channel.serverId,
        },
      });

      if (!isMember) {
        return res
          .status(403)
          .json({ error: "You're not a member of this server" });
      }

      const message = await prisma.message.create({
        data: {
          content,
          channelId,
          userId,
        },
      });
      const io = req.app.get("io") as Server;
      io.to(channelId).emit(Event.NEW_MESSAGE, message);

      return res.status(200).json(message);
    } catch (err) {
      console.error("Error sending message:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/channels/:channelId/messages",
  authenticateToken,
  async (req, res): Promise<any> => {
    const userId = req?.userId;
    const { channelId } = req.params;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      const channel = await prisma.channel.findUnique({
        where: { id: channelId },
      });

      if (!channel) return res.status(404).json({ error: "Channel not found" });

      const isMember = await prisma.member.findFirst({
        where: {
          userId,
          serverId: channel.serverId,
        },
      });

      if (!isMember) {
        return res
          .status(403)
          .json({ error: "You are not a member of this server" });
      }

      const messages = await prisma.message.findMany({
        where: { channelId },
        orderBy: { createdAt: "asc" },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });

      res.json(messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.patch(
  "/messages/:messageId",
  authenticateToken,
  async (req, res): Promise<any> => {
    const userId = req?.userId;
    const { messageId } = req.params;
    const { content } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!content) return res.status(400).json({ error: "Content required" });

    try {
      const message = await prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message) return res.status(404).json({ error: "Message not found" });
      if (message.userId !== userId)
        return res.status(403).json({ error: "Not your message" });

      const updated = await prisma.message.update({
        where: { id: messageId },
        data: { content },
      });

      const io = req.app.get("io") as Server;
      io.to(message.channelId).emit(Event.MESSAGE_EDITED, updated);

      return res.status(200).json(updated);
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete(
  "/messages/:messageId",
  authenticateToken,
  async (req, res): Promise<any> => {
    const userId = req?.userId;
    const { messageId } = req.params;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      const message = await prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message) return res.status(404).json({ error: "Message not found" });
      if (message.userId !== userId)
        return res.status(403).json({ error: "Not your message" });

      await prisma.message.delete({ where: { id: messageId } });

      const io = req.app.get("io") as Server;
      io.to(message.channelId).emit(Event.MESSAGE_DELETED, { id: messageId });

      res.status(200).json({ message: "Deleted" });
    } catch (err) {
      console.error("Delete error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
