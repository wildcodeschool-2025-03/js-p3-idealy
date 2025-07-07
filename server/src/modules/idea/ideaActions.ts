import fs from "node:fs";
import path from "node:path";
import type { RequestHandler } from "express";
import type { Request } from "express";
import type { Fields, File, Files } from "formidable";
import type formidable from "formidable";
import databaseClient from "../../../database/client";
import type { Result } from "../../../database/client";
import categoryIdeaRepository from "../categoryIdea/categoryIdeaRepository";
import mediaRepository from "../media/mediaRepository";
// Import access to data
import ideaRepository from "./ideaRepository";

interface RequestWithId extends Request {
  id?: number;
}

interface RequestWithFiles extends Request {
  files?: File[];
}

// Crée un dossier temporaire si besoin pour stocker les fichiers
const uploadDir = path.join(__dirname, "../../../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    const { user_id, statut, sort, toValidate } = req.query;
    const ideas = await ideaRepository.readAll({
      user_id: user_id ? Number(user_id) : undefined,
      statut: statut ? Number(statut) : undefined,
      sort: sort ? String(sort) : undefined,
      toValidate: toValidate === "1",
    });
    res.json(ideas);
  } catch (err) {
    console.error("Erreur dans GET /api/ideas :", err);
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
const add: RequestHandler = async (req, res, next) => {
  console.log("=== DEBUG ADD ===");
  console.log("req.body:", req.body);
  console.log("req.headers['content-type']:", req.headers["content-type"]);
  try {
    // Utilise les données déjà validées et parsées par validateIdeaSchema
    const {
      title,
      description,
      deadline,
      timestamp,
      statut_id,
      creator_id,
      categories,
      participants,
    } = req.body;

    // Cast req pour accéder à files
    const reqWithFiles = req as RequestWithFiles;
    const uploadedFiles = reqWithFiles.files || [];

    // Création de l'idée
    const newIdea = {
      title,
      description,
      deadline,
      timestamp,
      statut_id,
    };

    const ideaId = await ideaRepository.create(newIdea);

    // Catégories (array)
    for (const catId of categories) {
      await categoryIdeaRepository.link(Number(catId), ideaId);
    }

    // Participants (array)
    for (const participantId of participants) {
      await databaseClient.query(
        "INSERT INTO user_idea (user_id, idea_id, isCreator) VALUES (?, ?, ?)",
        [participantId, ideaId, 0],
      );
    }

    // Ajoute le créateur
    await databaseClient.query(
      "INSERT INTO user_idea (user_id, idea_id, isCreator) VALUES (?, ?, ?)",
      [creator_id, ideaId, 1],
    );

    // Médias (fichiers)
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

//admin page
/*const browseToValidate: RequestHandler = async (req, res, next) => {
  try {
    const ideas = await ideaRepository.findIdeasToValidate();
    res.json(ideas);
  } catch (err) {
    console.error("Erreur SQL dans /api/ideas/to-validate :", err); 
    next(err);
  }
};*/

//admin page update

/*const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === "true",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});*/

const putValidationOrRefusal: RequestHandler = async (req, res, next) => {
  console.log("BODY REÇU POUR LA VALIDATION/REFUS :", req.body);
  try {
    const deadline = String(req.body.deadline).split("T")[0];
    const idea = {
      id: Number(req.params.id),
      title: String(req.body.title),
      description: String(req.body.description),
      deadline,
      statut_id: Number(req.body.statut_id),
      justification: req.body.justification,
    };
    console.log("PUT idea", idea);

    const affectedRows = await ideaRepository.putValidationOrRefusal(idea);

    if (affectedRows === false) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

const deleteIdea: RequestHandler = async (req, res, next) => {
  try {
    const ideaId = Number(req.params.id);
    await ideaRepository.deleteIdea(ideaId);
    console.log("DELETE idea", ideaId);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const readHistory: RequestHandler = async (req, res, next) => {
  try {
    const ideas = await ideaRepository.readHistory();
    res.json(ideas);
  } catch (err) {
    next(err);
  }
};

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

const getParticipantsOfThisIdea: RequestHandler = async (req, res, next) => {
  try {
    const ideaId = Number(req.params.id);
    const participants = await ideaRepository.getParticipantsOfThisIdea(ideaId);
    res.json(participants);
  } catch (err) {
    next(err);
  }
};

const getMediasOfThisIdea: RequestHandler = async (req, res, next) => {
  try {
    const ideaId = Number(req.params.id);
    const medias = await ideaRepository.getMediasOfThisIdea(ideaId);
    res.json(medias);
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
  getParticipantsOfThisIdea,
  getMediasOfThisIdea,
  putValidationOrRefusal,
  deleteIdea,
  readHistory,
};
