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
