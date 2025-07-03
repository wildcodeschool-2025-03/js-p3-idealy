// server/tests/statistics/routes.spec.ts
// Tests for the statistics API routes

import express from "express";
import supertest from "supertest";
import { getStatistics } from "../../src/modules/statistics/statisticsActions";
import statisticsRepository from "../../src/modules/statistics/statisticsRepository";

jest.mock("../../src/modules/statistics/statisticsRepository");

describe("GET /api/statistics", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Route minimaliste dans le test, pas besoin d'importer le vrai router
    const router = express.Router();
    router.get("/api/statistics", getStatistics);
    app.use(router);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return valid statistics successfully", async () => {
    (
      statisticsRepository.countIdeasSubmittedThisMonth as jest.Mock
    ).mockResolvedValue(4);
    (statisticsRepository.countLikesAdded as jest.Mock).mockResolvedValue(12);
    (statisticsRepository.countIdeasValidated as jest.Mock).mockResolvedValue(
      2,
    );

    const response = await supertest(app).get("/api/statistics");

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      submittedThisMonth: 4,
      likesAdded: 12,
      ideasValidated: 2,
    });
  });

  it("should handle internal server errors", async () => {
    (
      statisticsRepository.countIdeasSubmittedThisMonth as jest.Mock
    ).mockRejectedValue(new Error("Database error"));

    const response = await supertest(app).get("/api/statistics");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({});
  });
});
