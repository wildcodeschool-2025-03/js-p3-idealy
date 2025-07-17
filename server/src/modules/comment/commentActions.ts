import type { RequestHandler } from "express";

import commentRepository from "./commentRepository";

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    // Extract the comment data from the request body
    const newComment = {
      content: req.body.content,
      idea_id: req.body.idea_id,
      user_id: req.body.user_id,
    };

    // Create the comment
    const insertId = await commentRepository.create(newComment);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted comment
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const getCommentsForIdea: RequestHandler = async (req, res, next) => {
  try {
    const ideaId = Number(req.params.id); // recupere l'ID depuis l'URL et convertit l'id en number

    const comments = await commentRepository.getCommentsForIdea(ideaId); // stock les commentaires dans un tableau d'objet [{}]

    res.json(comments);
  } catch (err) {
    next(err);
  }
};

// Transfer comments from a user to user_id=2
const transferComment: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: "Missing userId" });
      return;
    }

    await commentRepository.transferToUser2(userId);

    res
      .status(200)
      .json({ message: "Comments transferred to user_id=2 successfully" });
  } catch (err) {
    console.error("Error transferring comments to user_id=2:", err);
    next(err);
  }
};

export default {
  add,
  getCommentsForIdea,
  transferComment,
};
