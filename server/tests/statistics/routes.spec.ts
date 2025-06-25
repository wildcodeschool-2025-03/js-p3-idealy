// server/tests/statistics/routes.spec.ts
// Tests for the statistics API routes

import supertest from "supertest";
import app from "../../src/app";

// On mocke le module statisticsRepository
import statisticsRepository from "../../src/modules/statistics/statisticsRepository";

describe("GET /api/statistics", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return valid statistics successfully", async () => {
    jest
      .spyOn(statisticsRepository, "countIdeasSubmittedThisMonth")
      .mockResolvedValue(4);
    jest.spyOn(statisticsRepository, "countLikesAdded").mockResolvedValue(12);
    jest
      .spyOn(statisticsRepository, "countIdeasValidated")
      .mockResolvedValue(2);

    const response = await supertest(app).get("/api/statistics");

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      submittedThisMonth: 4,
      likesAdded: 12,
      ideasValidated: 2,
    });
  });

  it("should handle internal server errors", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    jest
      .spyOn(statisticsRepository, "countIdeasSubmittedThisMonth")
      .mockRejectedValue(new Error("Database error"));

    const response = await supertest(app).get("/api/statistics");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({}); // ou un autre contenu si modifié plus tard

    expect(errorSpy).toHaveBeenCalledWith(expect.any(Error));

    errorSpy.mockRestore();
  });
});
