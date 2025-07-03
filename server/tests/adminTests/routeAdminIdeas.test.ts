import "dotenv/config";
import jwt from "jsonwebtoken";
import supertest from "supertest";
import app from "../../src/app";
import ideaRepository from "../../src/modules/idea/ideaRepository";

// Mock la base pour le test
import type { RowDataPacket } from "mysql2";

jest
  .spyOn(ideaRepository, "readAll")
  .mockResolvedValue([{ id: 1, title: "Test idea" } as RowDataPacket]);

describe("Admin API integration", () => {
  test("GET /api/ideas doit répondre 200 et retourner un tableau", async () => {
    const token = jwt.sign(
      { id: 1, isAdmin: true },
      process.env.JWT_SECRET as string,
    );

    const response = await supertest(app)
      .get("/api/ideas")
      .set("Authorization", `Bearer ${token}`);

    if (response.status !== 200) {
      console.error("Erreur API:", response.status, response.body);
    }

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
