// server/tests/idea/validateIdeaSchema.int.spec.ts
// Tests d'intégration pour le middleware validateIdeaSchema

import path from "node:path";
import express, {
  type RequestHandler,
  type Request,
  Response,
  NextFunction,
} from "express";
import request from "supertest";
import { validateIdeaSchema } from "../../src/modules/idea/validateIdeaSchema";

interface RequestWithId extends Request {
  id?: number; // rendre optionnel pour éviter conflit de type
}

// App Express pour test
const app = express();

// Middleware simulant une authentification, ajoute req.id = 42
const authMiddleware: RequestHandler = (req, _res, next) => {
  (req as Request & { user?: { id: number; isAdmin: boolean } }).user = {
    id: 42,
    isAdmin: false,
  };
  next();
};

app.use(authMiddleware);

// Route de test avec middleware de validation
app.post("/api/ideas", validateIdeaSchema, (_req, res) => {
  res.status(200).json({ message: "Validé" });
});

describe("Integration: POST /api/ideas with validateIdeaSchema", () => {
  it("should accept a valid multipart/form-data submission", async () => {
    const response = await request(app)
      .post("/api/ideas")
      .field("title", "Une idée super")
      .field("description", "<p>Description riche et complète</p>")
      .field("deadline", new Date(Date.now() + 86400000).toISOString())
      .field("statut_id", "1")
      .field("creator_id", "42")
      .field("categories", "1")
      .attach("files", path.join(__dirname, "../fixtures/test.pdf"));

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Validé" });
  });

  it("should reject a spoofing attempt", async () => {
    const response = await request(app)
      .post("/api/ideas")
      .field("title", "Tentative")
      .field("description", "<p>Fake</p>")
      .field("deadline", new Date(Date.now() + 86400000).toISOString())
      .field("statut_id", "1")
      .field("creator_id", "999") // différent du req.id = 42
      .field("categories", "1");

    expect(response.statusCode).toBe(403);
    expect(response.body.error).toMatch(/spoofing/i);
  });
});
