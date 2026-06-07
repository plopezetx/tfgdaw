import { Router, type Request, type Response } from "express";
import Groq from "groq-sdk";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/chat", requireAuth, async (req: Request, res: Response) => {
  const { message, fileContent, fileName, selection } = req.body as {
    message: string;
    fileContent: string;
    fileName: string;
    selection?: string;
  };

  if (!message?.trim()) {
    res.status(400).json({ message: "El mensaje no puede estar vacío" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const systemPrompt = `Eres un asistente experto de programación integrado en un IDE web.
Ayudas a los usuarios a entender y modificar su código.
Cuando propongas cambios en el código, incluye el contenido completo del archivo modificado en un único bloque de código.
Sé conciso y céntrate en lo que el usuario solicita.
Responde siempre en el mismo idioma que el usuario.`;

  const contextParts: string[] = [`Archivo: ${fileName}`];

  if (selection?.trim()) {
    contextParts.push(`\nCódigo seleccionado:\n\`\`\`\n${selection}\n\`\`\``);
  }

  if (fileContent?.trim()) {
    contextParts.push(`\nContenido completo del archivo:\n\`\`\`\n${fileContent}\n\`\`\``);
  }

  contextParts.push(`\nPetición del usuario: ${message}`);

  try {
    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 8192,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: contextParts.join("\n") },
      ],
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content ?? "";
      if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: "Error al contactar con la IA" })}\n\n`);
    res.end();
  }
});

export default router;
