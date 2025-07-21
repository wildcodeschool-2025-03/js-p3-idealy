// server/tests/idea/validateIdeaSchema.spec.ts

import type { NextFunction, Request, Response } from "express";
import formidable from "formidable";
import type { Fields, Files } from "formidable";
import httpMocks from "node-mocks-http";
import type { MockResponse } from "node-mocks-http";
import { validateIdeaSchema } from "../../src/modules/idea/validateIdeaSchema";

jest.mock("formidable", () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      parse: jest.fn(),
    })),
  };
});

// Fonction utilitaire propre pour parser le contenu JSON de la réponse mockée
const getJson = (res: MockResponse<Response>) => JSON.parse(res._getData());

describe("validateIdeaSchema middleware", () => {
  const mockFormidable = formidable as unknown as jest.Mock;

  let req: Request;
  let res: MockResponse<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { user: { id: 42 } } as unknown as Request;
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should validate a correct idea submission", async () => {
    const fields: Fields = {
      title: ["Valid Idea"],
      description: ["<b>Rich</b> content."],
      deadline: [new Date(Date.now() + 86400000).toISOString()],
      statut_id: ["1"],
      creator_id: ["42"],
      categories: ["1"],
    };

    const files: Files = {
      files: [
        {
          mimetype: "application/pdf",
          size: 1024,
          originalFilename: "test.pdf",
          filepath: "/fake/path/test.pdf",
          newFilename: "test.pdf",
          hashAlgorithm: false,
          toJSON: () => ({
            filepath: "/fake/path/test.pdf",
            newFilename: "test.pdf",
            mimetype: "application/pdf",
            size: 1024,
            originalFilename: "test.pdf",
            mtime: new Date(),
            hashAlgorithm: false,
            length: 1,
          }),
        },
      ],
    };

    const parseMock = jest.fn((_req, cb) => cb(null, fields, files));
    mockFormidable.mockReturnValue({ parse: parseMock });

    await validateIdeaSchema(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });

  it("should reject if formidable returns error", async () => {
    const parseMock = jest.fn((_req, cb) =>
      cb(new Error("Parsing error"), null, null),
    );
    mockFormidable.mockReturnValue({ parse: parseMock });

    await validateIdeaSchema(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(getJson(res)).toMatchObject({ error: expect.any(String) });
  });

  it("should reject on spoofing attempt", async () => {
    const fields = {
      title: ["Idea"],
      description: ["Description longue."],
      deadline: [new Date(Date.now() + 86400000).toISOString()],
      statut_id: ["1"],
      creator_id: ["99"],
      categories: ["1"],
    };
    const parseMock = jest.fn((_req, cb) => cb(null, fields, {}));
    mockFormidable.mockReturnValue({ parse: parseMock });

    await validateIdeaSchema(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(getJson(res)).toMatchObject({
      error: expect.stringMatching(/spoofing/i),
    });
  });

  it("should reject when fields are invalid", async () => {
    const fields = {
      title: ["Id"],
      description: ["Too short"],
      deadline: ["invalid-date"],
      statut_id: ["2"],
      creator_id: ["42"],
      categories: [],
    };
    const parseMock = jest.fn((_req, cb) => cb(null, fields, {}));
    mockFormidable.mockReturnValue({ parse: parseMock });

    await validateIdeaSchema(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(getJson(res)).toMatchObject({
      error: expect.any(String),
      details: expect.any(Array),
    });
  });

  it("should reject file with invalid MIME type", async () => {
    const fields = {
      title: ["Valid"],
      description: ["<b>desc</b>"],
      deadline: [new Date(Date.now() + 86400000).toISOString()],
      statut_id: ["1"],
      creator_id: ["42"],
      categories: ["1"],
    };
    const files = {
      files: {
        mimetype: "text/plain",
        size: 1024,
        originalFilename: "bad.txt",
        filepath: "/fake/path/bad.txt",
        newFilename: "bad.txt",
        hashAlgorithm: false,
        toJSON: () => ({
          filepath: "/fake/path/bad.txt",
          newFilename: "bad.txt",
          mimetype: "text/plain",
          size: 1024,
          originalFilename: "bad.txt",
          mtime: new Date(),
          hashAlgorithm: false,
          length: 1,
        }),
      },
    };

    const parseMock = jest.fn((_req, cb) => cb(null, fields, files));
    mockFormidable.mockReturnValue({ parse: parseMock });

    await validateIdeaSchema(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(getJson(res)).toMatchObject({
      error: expect.stringMatching(/non autorisé/i),
    });
  });

  it("should reject file too large", async () => {
    const fields = {
      title: ["Valid"],
      description: ["<b>desc</b>"],
      deadline: [new Date(Date.now() + 86400000).toISOString()],
      statut_id: ["1"],
      creator_id: ["42"],
      categories: ["1"],
    };
    const files = {
      files: {
        mimetype: "application/pdf",
        size: 6 * 1024 * 1024,
        originalFilename: "too-big.pdf",
        filepath: "/fake/path/too-big.pdf",
        newFilename: "too-big.pdf",
        hashAlgorithm: false,
        toJSON: () => ({
          filepath: "/fake/path/too-big.pdf",
          newFilename: "too-big.pdf",
          mimetype: "application/pdf",
          size: 6 * 1024 * 1024,
          originalFilename: "too-big.pdf",
          mtime: new Date(),
          hashAlgorithm: false,
          length: 1,
        }),
      },
    };

    const parseMock = jest.fn((_req, cb) => cb(null, fields, files));
    mockFormidable.mockReturnValue({ parse: parseMock });

    await validateIdeaSchema(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(getJson(res)).toMatchObject({
      error: expect.stringMatching(/trop volumineux/i),
    });
  });
});
