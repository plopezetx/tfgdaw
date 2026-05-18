import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.use(requireAuth);

// GET /projects — lista de proyectos del usuario autenticado
router.get("/", async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { ownerId: req.user!.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      isPublic: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  res.json(projects);
});

// POST /projects — crear proyecto nuevo
router.post("/", async (req, res) => {
  const { name, description } = req.body as {
    name?: string;
    description?: string;
  };

  if (!name) {
    res.status(400).json({ message: "name es obligatorio" });
    return;
  }

  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const slug = `${baseSlug}-${Date.now()}`;

  const project = await prisma.project.create({
    data: {
      name,
      description,
      slug,
      ownerId: req.user!.id,
    },
  });

  res.status(201).json(project);
});

// GET /projects/:id — obtener proyecto con su snapshot
router.get("/:id", async (req, res) => {
  const project = await prisma.project.findFirst({
    where: { id: req.params.id, ownerId: req.user!.id },
    include: { snapshot: true },
  });

  if (!project) {
    res.status(404).json({ message: "Proyecto no encontrado" });
    return;
  }

  res.json(project);
});

// PUT /projects/:id — actualizar metadatos del proyecto
router.put("/:id", async (req, res) => {
  const { name, description, isPublic } = req.body as {
    name?: string;
    description?: string;
    isPublic?: boolean;
  };

  const existing = await prisma.project.findFirst({
    where: { id: req.params.id, ownerId: req.user!.id },
  });

  if (!existing) {
    res.status(404).json({ message: "Proyecto no encontrado" });
    return;
  }

  const updated = await prisma.project.update({
    where: { id: req.params.id },
    data: { name, description, isPublic },
  });

  res.json(updated);
});

// DELETE /projects/:id
router.delete("/:id", async (req, res) => {
  const existing = await prisma.project.findFirst({
    where: { id: req.params.id, ownerId: req.user!.id },
  });

  if (!existing) {
    res.status(404).json({ message: "Proyecto no encontrado" });
    return;
  }

  await prisma.project.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// PUT /projects/:id/snapshot — guardar archivos del proyecto
router.put("/:id/snapshot", async (req, res) => {
  const { files } = req.body as { files?: unknown };

  if (!files) {
    res.status(400).json({ message: "files es obligatorio" });
    return;
  }

  const existing = await prisma.project.findFirst({
    where: { id: req.params.id, ownerId: req.user!.id },
  });

  if (!existing) {
    res.status(404).json({ message: "Proyecto no encontrado" });
    return;
  }

  const snapshot = await prisma.projectSnapshot.upsert({
    where: { projectId: req.params.id },
    create: { projectId: req.params.id, files },
    update: { files },
  });

  res.json(snapshot);
});

// GET /projects/:id/snapshot — cargar archivos del proyecto
router.get("/:id/snapshot", async (req, res) => {
  const project = await prisma.project.findFirst({
    where: { id: req.params.id, ownerId: req.user!.id },
    include: { snapshot: true },
  });

  if (!project) {
    res.status(404).json({ message: "Proyecto no encontrado" });
    return;
  }

  res.json(project.snapshot ?? { files: [] });
});

export default router;
