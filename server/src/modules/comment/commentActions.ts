import type { RequestHandler } from "express";

import commentRepository from "./commentRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all items
    const comments = await commentRepository.readAll();

    // Respond with the items in JSON format
    res.json(comments);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific item based on the provided ID
    const commentId = Number(req.params.id);
    const comment = await commentRepository.read(commentId);

    // If the item is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the item in JSON format
    if (comment == null) {
      res.sendStatus(404);
    } else {
      res.json(comment);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

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

const edit: RequestHandler = async (req, res, next) => {
  try {
    // Update a specific comment based on the provided ID
    const comment = {
      id: Number(req.params.id),
      content: req.body.content,
      idea_id: req.body.idea_id,
      user_id: req.body.user_id,
    };

    const affectedRows = await commentRepository.update(comment);

    // If the comment is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the comment in JSON format
    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
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

const destroy: RequestHandler = async (req, res, next) => {
  try {
    // Delete a specific category based on the provided ID
    const commentId = Number(req.params.id);

    await commentRepository.delete(commentId);

    // Respond with HTTP 204 (No Content) anyway
    res.sendStatus(204);
  } catch (err) {
    // Pass any errors to the error-handling middleware
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
  browse,
  read,
  add,
  edit,
  destroy,
  getCommentsForIdea,
  transferComment,
};
