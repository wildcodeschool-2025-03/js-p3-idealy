import type { RequestHandler } from "express";

// Import access to data
import ideaRepository from "./ideaRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    const ideas = await ideaRepository.readAll();

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
const add: RequestHandler = async (req, res, next) => {
  try {
    const newIdea = {
      title: req.body.title,
      description: req.body.description,
      deadline: req.body.deadline,
      statut_id: req.body.statut_id,
    };

    const insertId = await ideaRepository.create(newIdea);

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add };
