// server/src/modules/idea/validateIdeaSchema.ts
// Ce fichier contient le middleware de validation des idées

import path from "node:path";
import type { Request, RequestHandler, Response } from "express";
import formidable from "formidable";
import type { Fields, File, Files } from "formidable";
import Joi from "joi";
import sanitizeHtml from "sanitize-html";

interface FileData {
  mimetype: string | null; // <-- accepte string ou null (correction)
  size: number;
  originalFilename: string;
  filepath: string;
  newFilename: string;
  // ajoute d'autres propriétés si besoin
}

interface RequestWithIdAndFiles extends Request {
  id?: number;
  files?: FileData[];
}

// Autorisations fichiers
const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo

// Schéma Joi de validation des champs de l’idée
const ideaSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(10).required(),
  deadline: Joi.date().iso().greater("now").required(),
  timestamp: Joi.date().iso().optional(),
  statut_id: Joi.number().valid(1).required(),
  creator_id: Joi.number().required(),
  categories: Joi.array().items(Joi.number()).min(1).required(),
  participants: Joi.array().items(Joi.number()).optional(),
});

// Middleware complet
export const validateIdeaSchema: RequestHandler = (req, res, next) => {
  const reqTyped = req as RequestWithIdAndFiles;

  const form = formidable({
    multiples: true,
    maxFileSize: MAX_FILE_SIZE_BYTES,
    uploadDir: path.join(__dirname, "../../../public/uploads"),
    keepExtensions: false,
    filename: (name, ext, part) => {
      const randomName =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      const originalExt = part.originalFilename?.split(".").pop() || "";
      return originalExt ? `${randomName}.${originalExt}` : randomName;
    },
  });

  form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
    if (err) {
      console.error("Erreur parsing FormData :", err);
      return res.status(400).json({ error: "Échec de lecture des données." });
    }

    try {
      // Convertit les champs dans un format exploitable pour Joi
      const parsedBody = {
        ...fields,
        title: Array.isArray(fields.title) ? fields.title[0] : fields.title,
        description: Array.isArray(fields.description)
          ? fields.description[0]
          : fields.description,
        deadline: Array.isArray(fields.deadline)
          ? fields.deadline[0]
          : fields.deadline,
        timestamp: Array.isArray(fields.timestamp)
          ? fields.timestamp[0]
          : fields.timestamp,
        statut_id: Number(
          Array.isArray(fields.statut_id)
            ? fields.statut_id[0]
            : fields.statut_id,
        ),
        creator_id: Number(
          Array.isArray(fields.creator_id)
            ? fields.creator_id[0]
            : fields.creator_id,
        ),
        categories: Array.isArray(fields.categories)
          ? fields.categories.map((v) => Number(v))
          : [Number(fields.categories)],
        participants: fields.participants
          ? Array.isArray(fields.participants)
            ? fields.participants.map((v) => Number(v))
            : [Number(fields.participants)]
          : [],
      };

      // Validation avec Joi
      const { error, value } = ideaSchema.validate(parsedBody, {
        abortEarly: false,
      });

      if (error) {
        return res.status(400).json({
          error: "Champs invalides",
          details: error.details.map((e) => e.message),
        });
      }

      // Vérifie l'authentification
      const loggedUserId = req.user?.id;
      if (value.creator_id !== loggedUserId) {
        return res
          .status(403)
          .json({ error: "Tentative de spoofing détectée" });
      }

      // Sanitize la description HTML
      value.description = sanitizeHtml(value.description, {
        allowedTags: [
          "b",
          "i",
          "u",
          "em",
          "strong",
          "a",
          "ul",
          "ol",
          "li",
          "br",
          "span",
          "font",
        ],
        allowedAttributes: {
          a: ["href", "target"],
          span: ["style"],
          font: ["color", "size"],
          "*": ["style"],
        },
        allowedStyles: {
          "*": {
            color: [
              /^#[0-9a-fA-F]{3,6}$/,
              /^rgb\((\d{1,3},\s*){2}\d{1,3}\)$/,
              /^rgba\((\d{1,3},\s*){3}\d?(\.\d+)?\)?$/,
            ],
            "font-size": [/^\d+(px|em|rem|%)$/],
            "text-decoration": [/^underline$/],
          },
        },
      });

      // Vérifie les fichiers joints et adapte le type mimetype
      const rawFiles = files?.files
        ? Array.isArray(files.files)
          ? files.files
          : [files.files]
        : [];

      // On cast les fichiers vers FileData, en assurant que mimetype est string (ou "")
      const fileArray: FileData[] = rawFiles.map((file: File) => ({
        mimetype: file.mimetype ?? "", // null devient ""
        size: file.size,
        originalFilename: file.originalFilename ?? "",
        filepath: file.filepath,
        newFilename: file.newFilename,
      }));

      // Validation des fichiers autorisés
      for (const file of fileArray) {
        if (!ALLOWED_FILE_TYPES.includes(file.mimetype ?? "")) {
          return res
            .status(400)
            .json({ error: `Fichier non autorisé : ${file.originalFilename}` });
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
          return res.status(400).json({
            error: `Fichier trop volumineux : ${file.originalFilename}`,
          });
        }
      }

      // Tout est validé : on attache les données nettoyées à la requête
      req.body = value;
      reqTyped.files = fileArray;

      next();
    } catch (e) {
      console.error("Erreur middleware validateIdeaSchema :", e);
      return res.status(500).json({ error: "Erreur interne de validation" });
    }
  });
};

// Export pour tests unitaires
export { ideaSchema, ALLOWED_FILE_TYPES, MAX_FILE_SIZE_BYTES };
