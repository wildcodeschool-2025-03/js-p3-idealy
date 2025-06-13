import type { RequestHandler } from "express";

// Import access to data
import mediaRepository from "./mediaRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all media
    const medias = await mediaRepository.readAll();

    // Respond with the media in JSON format
    res.json(medias);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific item based on the provided ID
    const mediaId = Number(req.params.id);
    const media = await mediaRepository.read(mediaId);

    // If the item is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the item in JSON format
    if (media == null) {
      res.sendStatus(404);
    } else {
      res.json(media);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    // Extract the media data from the request body
    const newMedia = {
      url: req.body.url,
      type: req.body.type,
      idea_id: req.body.idea_id,
    };

    // Create the media
    const insertId = await mediaRepository.create(newMedia);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted media
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    // Update a specific media based on the provided ID
    const media = {
      id: Number(req.params.id),
      url: req.body.url,
      type: req.body.type,
      idea_id: req.body.idea_id,
    };

    const affectedRows = await mediaRepository.update(media);

    // If the media is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the media in JSON format
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

const destroy: RequestHandler = async (req, res, next) => {
  try {
    // Delete a specific media based on the provided ID
    const mediaId = Number(req.params.id);

    await mediaRepository.delete(mediaId);

    // Respond with HTTP 204 (No Content) anyway
    res.sendStatus(204);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

export default { browse, read, add, edit, destroy };
