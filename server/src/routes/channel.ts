import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth";
import { Server } from "socket.io";
import { Event, Role } from "../utils/enum";

const router = express.Router();
const prisma = new PrismaClient();

router.get(
  "/servers/:serverId/channels",
  authenticateToken,
  async (req, res): Promise<any> => {
    const userId = req?.userId;
    const { serverId } = req.params;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      const isMember = await prisma.member.findFirst({
        where: {
          userId,
          serverId,
        },
      });
      if (!isMember) {
        return res
          .status(403)
          .json({ error: "You're not a member of this server" });
      }
      const channels = await prisma.channel.findMany({
        where: { serverId },
      });
      return res.status(200).json(channels);
    } catch (err) {
      console.error("Error fetching channels:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/channels/:channelId",
  authenticateToken,
  async (req, res): Promise<any> => {
    const userId = req.userId;
    const { channelId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const channel = await prisma.channel.findUnique({
        where: { id: channelId },
      });

      if (!channel) {
        return res.status(404).json({ error: "Channel not found" });
      }

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

      return res.status(200).json(channel);
    } catch (err) {
      console.error("Error fetching channel details:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post(
  "/servers/:serverId/channels",
  authenticateToken,
  async (req, res): Promise<any> => {
    const userId = req?.userId;
    const { serverId } = req.params;
    const { name, type } = req.body;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!name || !type)
      return res.status(400).json({ error: "Name and type required" });

    try {
      const isMember = await prisma.member.findFirst({
        where: {
          userId,
          serverId,
          role: Role.admin,
        },
      });
      if (!isMember) {
        return res.status(403).json({
          error:
            "You're not a member of this server or not allowed to perform this action",
        });
      }
      const channel = await prisma.channel.create({
        data: {
          name,
          type,
          serverId,
        },
      });
      const io = req.app.get("io") as Server;
      io.to(serverId).emit(Event.CREATE_CHANNEL, channel);

      return res.status(200).json(channel);
    } catch (err) {
      console.error("Error creating channel:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.delete(
  "/channels/:channelId",
  authenticateToken,
  async (req, res): Promise<any> => {
    const userId = req?.userId;
    const { channelId } = req.params;

    try {
      const channel = await prisma.channel.findUnique({
        where: { id: channelId },
        include: { server: true },
      });

      if (!channel) return res.status(404).json({ error: "Channel not found" });

      const server = await prisma.server.findUnique({
        where: { id: channel.serverId },
      });

      if (server?.ownerId !== userId)
        return res.status(403).json({ error: "Not your server" });

      await prisma.channel.delete({ where: { id: channelId } });

      const io = req.app.get("io") as Server;
      io.to(channel.serverId).emit(Event.CHANNEL_DELETED, { id: channelId });

      return res.status(200).json({ message: "Channel deleted" });
    } catch (err) {
      console.error("Channel delete error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.patch(
  "/channels/:channelId",
  authenticateToken,
  async (req, res): Promise<any> => {
    const userId = req.userId;
    const { channelId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Channel name is required" });
    }

    try {
      const channel = await prisma.channel.findUnique({
        where: { id: channelId },
        include: { server: true },
      });

      if (!channel) {
        return res.status(404).json({ error: "Channel not found" });
      }

      const server = channel.server;

      if (server.ownerId !== userId) {
        return res.status(403).json({ error: "Not your server" });
      }

      const updatedChannel = await prisma.channel.update({
        where: { id: channelId },
        data: { name },
      });

      const io = req.app.get("io") as Server;
      io.to(server.id).emit(Event.CHANNEL_UPDATED, updatedChannel);

      return res.status(200).json(updatedChannel);
    } catch (err) {
      console.error("Error updating channel:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
