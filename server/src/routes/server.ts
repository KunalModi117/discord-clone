import { nanoid } from "nanoid";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth";
import { Role } from "../utils/enum";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", authenticateToken, async (req, res): Promise<any> => {
  const { name, image } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!name) return res.status(400).json({ error: "Server name is required" });
  const inviteCode = nanoid(10);

  try {
    const server = await prisma.server.create({
      data: {
        name,
        ownerId: userId,
        inviteCode,
        image: image || null,
      },
    });

    await prisma.member.create({
      data: {
        serverId: server.id,
        userId,
        role: Role.admin,
      },
    });

    await prisma.channel.create({
      data: {
        serverId: server.id,
        name: "general",
        type: "text",
      },
    });

    return res.status(201).json(server);
  } catch (err) {
    console.error("Error creating server:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", authenticateToken, async (req, res): Promise<any> => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const membership = await prisma.member.findMany({
      where: {
        userId,
      },
      include: {
        server: {
          include: {
            channels: true,
          },
        },
      },
    });

    const servers = membership.map((membership) => membership.server);

    return res.status(200).json(servers);
  } catch (err) {
    console.error("Error fetching servers:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/join", authenticateToken, async (req, res): Promise<any> => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { inviteCode } = req.body;

  if (!inviteCode) {
    return res.status(400).json({ error: "Invite code required" });
  }

  try {
    const server = await prisma.server.findUnique({
      where: { inviteCode },
      include: { channels: true },
    });

    if (!server) {
      return res.status(404).json({ error: "Invalid invite code" });
    }

    const existing = await prisma.member.findFirst({
      where: {
        userId,
        serverId: server.id,
      },
    });

    if (existing) {
      return res.status(400).json({ error: "Already joined this server" });
    }

    await prisma.member.create({
      data: {
        userId,
        serverId: server.id,
        role: Role.member,
      },
    });

    return res
      .status(200)
      .json({ message: "Joined server successfully", server });
  } catch (err) {
    console.error("Join server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete(
  "/:serverId",
  authenticateToken,
  async (req, res): Promise<any> => {
    const userId = req.userId;
    const { serverId } = req.params;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      const server = await prisma.server.findUnique({
        where: { id: serverId },
        include: {
          channels: true,
        },
      });

      if (!server) {
        return res.status(404).json({ error: "Server not found" });
      }

      if (server.ownerId !== userId) {
        return res
          .status(403)
          .json({ error: "Only the owner can delete the server" });
      }

      await prisma.channel.deleteMany({ where: { serverId } });
      await prisma.member.deleteMany({ where: { serverId } });
      await prisma.message.deleteMany({
        where: {
          channelId: {
            in: server.channels.map((channel) => channel.id),
          },
        },
      });
      await prisma.server.delete({
        where: { id: serverId },
      });

      return res.status(200).json({ message: "Server deleted successfully" });
    } catch (err) {
      console.error("Delete server error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.patch(
  "/:serverId",
  authenticateToken,
  async (req, res): Promise<any> => {
    const userId = req.userId;
    const { serverId } = req.params;
    const { name, image } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!name)
      return res.status(400).json({ error: "Server name is required" });

    try {
      const server = await prisma.server.findUnique({
        where: { id: serverId },
      });

      if (!server) {
        return res.status(404).json({ error: "Server not found" });
      }

      if (server.ownerId !== userId) {
        return res
          .status(403)
          .json({ error: "Only the owner can update the server" });
      }

      const updated = await prisma.server.update({
        where: { id: serverId },
        data: { name, image: image || null },
      });

      return res.status(200).json(updated);
    } catch (err) {
      console.error("Update server error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/:serverId/members",
  authenticateToken,
  async (req, res): Promise<any> => {
    const userId = req.userId;
    const { serverId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const isMember = await prisma.member.findFirst({
        where: { userId, serverId },
      });

      if (!isMember) {
        return res
          .status(403)
          .json({ error: "You're not a member of this server" });
      }

      const members = await prisma.member.findMany({
        where: { serverId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });

      return res.status(200).json(members);
    } catch (err) {
      console.error("Error fetching members:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);


export default router;
