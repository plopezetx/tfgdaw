import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

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

// PUT /auth/me — actualizar nombre de usuario y email
router.put("/me", requireAuth, async (req, res) => {
  const { username, email } = req.body as { username?: string; email?: string };

  if (!username?.trim() || !email?.trim()) {
    res.status(400).json({ message: "username y email son obligatorios" });
    return;
  }

  // Comprobar que el nuevo email/username no lo use otro usuario
  const conflict = await prisma.user.findFirst({
    where: {
      AND: [
        { id: { not: req.user!.id } },
        { OR: [{ email: email.trim() }, { username: username.trim() }] },
      ],
    },
  });

  if (conflict) {
    res.status(409).json({ message: "El email o nombre de usuario ya está en uso" });
    return;
  }

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { username: username.trim(), email: email.trim() },
  });

  res.json({ user: { id: user.id, email: user.email, username: user.username } });
});

// PUT /auth/password — cambiar contraseña
router.put("/password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!currentPassword || !newPassword) {
    res.status(400).json({ message: "Faltan campos obligatorios" });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ message: "La nueva contraseña debe tener al menos 6 caracteres" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    res.status(401).json({ message: "La contraseña actual no es correcta" });
    return;
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  res.json({ message: "Contraseña actualizada" });
});

export default router;
