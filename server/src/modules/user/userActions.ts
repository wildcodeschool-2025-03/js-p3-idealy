import type { RequestHandler } from "express";

// Import access to data
import userRepository from "./userRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all items
    const users = await userRepository.readAll();

    // Respond with the items in JSON format
    res.json(users);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific item based on the provided ID
    const userId = Number(req.params.id);
    const user = await userRepository.read(userId);

    // If the item is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the item in JSON format
    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    // Extract the item data from the request body
    const newUser = {
      id: Number(req.params.id),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      mail: req.body.mail,
      password: req.body.password,
      picture: req.body.picture,
      isAdmin: req.body.isAdmin,
      service_id: req.body.service_id,
    };

    // Create the service
    const insertId = await userRepository.create(newUser);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted item
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The D of BREAD - Delete operation
const destroy: RequestHandler = async (req, res, next) => {
  try {
    // Delete a specific service based on the provided ID
    const userId = Number(req.params.id);

    await userRepository.delete(userId);

    // Respond with HTTP 204 (No Content) anyway
    res.sendStatus(204);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The E of BREAD - Edit operation
const editPicture: RequestHandler = async (req, res, next) => {
  try {
    // Update a specific category based on the provided ID
    const user = {
      id: Number(req.params.id),
      picture: req.body.picture,
    };

    const affectedRows = await userRepository.updatePicture(user);

    // If the category is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the category in JSON format
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

const editFirstname: RequestHandler = async (req, res, next) => {
  try {
    // Update a specific category based on the provided ID
    const user = {
      id: Number(req.params.id),
      firstname: req.body.firstname,
    };

    const affectedRows = await userRepository.updateFirstname(user);

    // If the category is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the category in JSON format
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

const editLastname: RequestHandler = async (req, res, next) => {
  try {
    // Update a specific category based on the provided ID
    const user = {
      id: Number(req.params.id),
      lastname: req.body.lastname,
    };

    const affectedRows = await userRepository.updateLastname(user);

    // If the category is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the category in JSON format
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

const editMail: RequestHandler = async (req, res, next) => {
  try {
    // Update a specific category based on the provided ID
    const user = {
      id: Number(req.params.id),
      mail: req.body.mail,
    };

    const affectedRows = await userRepository.updateMail(user);

    // If the category is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the category in JSON format
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

const editPassword: RequestHandler = async (req, res, next) => {
  try {
    // Update a specific category based on the provided ID
    const user = {
      id: Number(req.params.id),
      password: req.body.password,
    };

    const affectedRows = await userRepository.updatePassword(user);

    // If the category is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the category in JSON format
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

const editService: RequestHandler = async (req, res, next) => {
  try {
    // Update a specific category based on the provided ID
    const user = {
      id: Number(req.params.id),
      service_id: req.body.service_id,
    };

    const affectedRows = await userRepository.updateService(user);

    // If the category is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the category in JSON format
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

export default {
  browse,
  read,
  destroy,
  add,
  editFirstname,
  editLastname,
  editMail,
  editPassword,
  editPicture,
  editService,
};
