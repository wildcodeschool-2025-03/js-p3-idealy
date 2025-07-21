import type { RequestHandler } from "express";

// Import access to data
import voteRepository from "./voteRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    const votes = await voteRepository.readAll();

    res.json(votes);
  } catch (err) {
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    const voteId = Number(req.params.id);
    const vote = await voteRepository.read(voteId);

    if (vote == null) {
      res.sendStatus(404);
    } else {
      res.json(vote);
    }
  } catch (err) {
    next(err);
  }
};

// Info complètes de votes pour un utilisateur (affichage carte)
const getVotesForIdea: RequestHandler = async (req, res, next) => {
  try {
    const ideaId = Number(req.params.id);
    const userId = req.query.user_id ? Number(req.query.user_id) : undefined;

    const voteData = await voteRepository.getVotesForIdeaWithUser(
      ideaId,
      userId,
    );
    res.json(voteData);
  } catch (err) {
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    const newVote = {
      agree: req.body.agree,
      disagree: req.body.disagree,
      idea_id: req.body.idea_id,
      user_id: req.body.user_id,
    };

    const insertId = await voteRepository.create(newVote);

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

// upsert = insert OU update
const upsert: RequestHandler = async (req, res, next) => {
  try {
    const { agree, disagree, idea_id, user_id } = req.body;

    // Vérifie si un vote existe déjà pour ce couple (user, idea)
    const existingVote = await voteRepository.readByIdeaAndUser(
      idea_id,
      user_id,
    );

    if (existingVote) {
      // Update
      await voteRepository.updateVote({ agree, disagree, idea_id, user_id });
      res.status(200).json({ message: "Vote mis à jour" });
    } else {
      // Create
      await voteRepository.create({ agree, disagree, idea_id, user_id });
      res.status(201).json({ message: "Vote créé" });
    }
  } catch (err) {
    next(err);
  }
};

// Delete all votes of a user
const deleteUserVotes: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: "Missing userId" });
      return;
    }

    await voteRepository.deleteByUserId(userId);

    res.status(200).json({ message: "User votes deleted successfully" });
  } catch (err) {
    console.error("Error deleting user votes:", err);
    next(err);
  }
};

export default { browse, read, add, upsert, getVotesForIdea, deleteUserVotes };
