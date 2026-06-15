import { Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

function createSlug(name: string): string {
  const baseSlug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "proyecto";

  return `${baseSlug}-${Date.now()}`;
}

// GET /projects/public/gallery - lista proyectos publicos
router.get("/public/gallery", async (_req, res) => {
  const projects = await prisma.project.findMany({
    where: { isPublic: true },
    orderBy: { updatedAt: "desc" },
    take: 30,
    select: {
      id: true,
      name: true,
      description: true,
      slug: true,
      views: true,
      createdAt: true,
      updatedAt: true,
      owner: {
        select: {
          username: true,
        },
      },
      _count: {
        select: { likes: true },
      },
    },
  });

  // Aplanamos el contador de likes para el frontend
  res.json(
    projects.map((project) => ({
      ...project,
      likeCount: project._count.likes,
    }))
  );
});

// GET /projects/public/:slug - proyecto publico con snapshot
router.get("/public/:slug", async (req, res) => {
  const project = await prisma.project.findFirst({
    where: { slug: req.params.slug, isPublic: true },
    include: {
      snapshot: true,
      owner: {
        select: {
          id: true,
          username: true,
        },
      },
      _count: {
        select: { likes: true },
      },
    },
  });

  if (!project) {
    res.status(404).json({ message: "Proyecto publico no encontrado" });
    return;
  }

  // Cada visita a la pagina publica suma una vista
  await prisma.project.update({
    where: { id: project.id },
    data: { views: { increment: 1 } },
  });

  res.json({
    ...project,
    views: project.views + 1,
    likeCount: project._count.likes,
  });
});

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

  const project = await prisma.project.create({
    data: {
      name,
      description,
      slug: createSlug(name),
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

// POST /projects/:id/fork - crea una copia propia de un proyecto publico
router.post("/:id/fork", async (req, res) => {
  const sourceProject = await prisma.project.findFirst({
    where: {
      id: req.params.id,
      isPublic: true,
    },
    include: {
      snapshot: true,
    },
  });

  if (!sourceProject) {
    res.status(404).json({ message: "Proyecto publico no encontrado" });
    return;
  }

  const forkedProject = await prisma.project.create({
    data: {
      name: `${sourceProject.name} (fork)`,
      description: sourceProject.description,
      slug: createSlug(`${sourceProject.name}-fork`),
      ownerId: req.user!.id,
      forkedFromId: sourceProject.id,
      snapshot: sourceProject.snapshot
        ? {
            create: {
              files: sourceProject.snapshot.files as Prisma.InputJsonValue,
            },
          }
        : undefined,
    },
    include: {
      snapshot: true,
    },
  });

  res.status(201).json(forkedProject);
});

// GET /projects/:id/like-status - saber si el usuario ha dado like y total
router.get("/:id/like-status", async (req, res) => {
  const liked = await prisma.like.findUnique({
    where: {
      userId_projectId: { userId: req.user!.id, projectId: req.params.id },
    },
  });

  const likeCount = await prisma.like.count({
    where: { projectId: req.params.id },
  });

  res.json({ liked: Boolean(liked), likeCount });
});

// POST /projects/:id/like - alterna el "me gusta" del usuario en un proyecto publico
router.post("/:id/like", async (req, res) => {
  const project = await prisma.project.findFirst({
    where: { id: req.params.id, isPublic: true },
  });

  if (!project) {
    res.status(404).json({ message: "Proyecto publico no encontrado" });
    return;
  }

  const existing = await prisma.like.findUnique({
    where: {
      userId_projectId: { userId: req.user!.id, projectId: project.id },
    },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({
      data: { userId: req.user!.id, projectId: project.id },
    });
  }

  const likeCount = await prisma.like.count({
    where: { projectId: project.id },
  });

  res.json({ liked: !existing, likeCount });
});

export default router;
