import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth"; // Correct path

const router = express.Router();
const prisma = new PrismaClient();

router.get("/me", authenticateToken, async (req, res): Promise<any> => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("GET /me error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
