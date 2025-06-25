import fs from "node:fs";
import path from "node:path";
import type { RequestHandler } from "express";
import type { Request } from "express";
import formidable, { type Fields, type Files } from "formidable";

import databaseClient from "../../../database/client";
import type { Result } from "../../../database/client";
import categoryIdeaRepository from "../categoryIdea/categoryIdeaRepository";
import mediaRepository from "../media/mediaRepository";
// Import access to data
import ideaRepository from "./ideaRepository";

interface RequestWithId extends Request {
  id?: number;
}

// Crée un dossier temporaire si besoin pour stocker les fichiers
const uploadDir = path.join(__dirname, "../../../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    const { user_id, statut, sort } = req.query;
    // If sort is "recent", we return the 5 most recent ideas
    const ideas = await ideaRepository.readAll({
      user_id: user_id ? Number(user_id) : undefined,
      statut: statut ? Number(statut) : undefined,
      sort: sort ? String(sort) : undefined,
    });
    res.json(ideas);
  } catch (err) {
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    const ideaId = Number(req.params.id);
    const idea = await ideaRepository.read(ideaId);

    if (idea == null) {
      res.sendStatus(404);
    } else {
      res.json(idea);
    }
  } catch (err) {
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = (req, res, next) => {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    uploadDir,
  });

  form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
    if (err) {
      console.error("Erreur lors du parsing du formulaire :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    try {
      const rawDeadline = getField(fields.deadline);
      const deadline = new Date(rawDeadline).toISOString().split("T")[0]; // "2025-07-17"

      // Création de l'idée
      const newIdea = {
        title: getField(fields.title),
        description: getField(fields.description),
        deadline, // format corrigé
        timestamp: getField(fields.timestamp),
        statut_id: Number(getField(fields.statut_id)),
      };

      const ideaId = await ideaRepository.create(newIdea);

      // Catégories (array)
      const categoryIds = getArray(fields.categories);
      for (const catId of categoryIds) {
        await categoryIdeaRepository.link(Number(catId), ideaId);
      }

      // Participants (array)
      const participantIds = getArray(fields.participants); // co-auteurs uniquement

      const creatorId = Number(getField(fields.creator_id)) || 1; // le user connecté ou l'admin par défaut

      // Ajoute le créateur
      await databaseClient.query(
        "INSERT INTO user_idea (user_id, idea_id, isCreator) VALUES (?, ?, ?)",
        [creatorId, ideaId, 1],
      );

      // Ajoute les co-auteurs (si présents)
      for (const coAuthorId of participantIds) {
        // Évite d'ajouter deux fois l'admin si jamais il est aussi dans les co-auteurs
        if (Number(coAuthorId) !== creatorId) {
          await databaseClient.query(
            "INSERT INTO user_idea (user_id, idea_id, isCreator) VALUES (?, ?, ?)",
            [coAuthorId, ideaId, 0],
          );
        }
      }

      // Médias (fichiers)
      const uploadedFiles = getFiles(files.files);
      for (const file of uploadedFiles) {
        const type = file.mimetype?.startsWith("video") ? "video" : "image";
        const filename = path.basename(file.filepath);
        await mediaRepository.create({
          url: `/uploads/${filename}`,
          type,
          idea_id: ideaId,
        });
      }

      res.status(201).json({ insertId: ideaId });
    } catch (error) {
      next(error);
    }
  });
};

// Helpers
const getField = (field: string | string[] | undefined): string =>
  Array.isArray(field) ? field[0] : (field ?? "");

const getArray = (field: string | string[] | undefined): string[] => {
  if (!field) return [];
  return Array.isArray(field) ? field : [field];
};

const getFiles = (
  files: formidable.File | formidable.File[] | undefined,
): formidable.File[] => {
  if (!files) return [];
  return Array.isArray(files) ? files : [files];
};

// Specific functions

// Retrieve the original creator of an idea, given the ID of the idea
const getCreatorOfThisIdea: RequestHandler = async (req, res, next) => {
  try {
    const ideaId = Number(req.params.id);
    const user = await ideaRepository.getCreatorOfThisIdea(ideaId);

    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    next(err);
  }
};

// Retrieve the votes informations of an idea, given the ID of the idea
const getVotesInformationsOfThisIdea: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const ideaId = Number(req.params.id);
    const votesInformations =
      await ideaRepository.getVotesInformationsOfThisIdea(ideaId);

    if (votesInformations == null) {
      res.sendStatus(404);
    } else {
      res.json(votesInformations);
    }
  } catch (err) {
    next(err);
  }
};

// Retrieve the categories (a table of all key words associated) of an idea, given the ID of the idea
const getCategoriesOfThisIdea: RequestHandler = async (req, res, next) => {
  try {
    const ideaId = Number(req.params.id);
    const categories = await ideaRepository.getCategoriesOfThisIdea(ideaId);
    if (categories == null) {
      res.sendStatus(404);
    } else {
      res.json(categories);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  browse,
  read,
  add,
  getCreatorOfThisIdea,
  getVotesInformationsOfThisIdea,
  getCategoriesOfThisIdea,
};
