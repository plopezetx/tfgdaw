import "express-async-errors";
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import projectsRouter from "./routes/projects";
import aiRouter from "./routes/ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/projects", projectsRouter);
app.use("/ai", aiRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
