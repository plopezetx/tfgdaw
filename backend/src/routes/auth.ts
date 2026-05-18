import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const router = Router();

// POST /auth/register
router.post("/register", async (req, res) => {
  const { email, username, password } = req.body as {
    email?: string;
    username?: string;
    password?: string;
  };

  if (!email || !username || !password) {
    res.status(400).json({ message: "email, username y password son obligatorios" });
    return;
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (existing) {
    res.status(409).json({ message: "El email o nombre de usuario ya existe" });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, username, password: hashed },
  });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET ?? "dev_secret",
    { expiresIn: "7d" }
  );

  res.status(201).json({ token, user: { id: user.id, email: user.email, username: user.username } });
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    res.status(400).json({ message: "email y password son obligatorios" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: "Credenciales incorrectas" });
    return;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET ?? "dev_secret",
    { expiresIn: "7d" }
  );

  res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
});

// POST /auth/logout — JWT es stateless; el cliente descarta el token
router.post("/logout", (_req, res) => {
  res.json({ message: "ok" });
});

export default router;
