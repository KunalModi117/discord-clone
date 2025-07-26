import { nanoid } from "nanoid";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth";
import { Role } from "../../utils/enum";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", authenticateToken, async (req, res): Promise<any> => {
  const { name } = req.body;
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
        server: true,
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
    });

    if (!server) {
      return res.status(404).json({ error: "Invalid invite code" });
    }

    // Already a member?
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

export default router;
