import type { RequestHandler } from "express";

// Import access to data
import serviceRepository from "./serviceRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all items
    const services = await serviceRepository.readAll();

    // Respond with the items in JSON format
    res.json(services);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific item based on the provided ID
    const serviceIdd = Number(req.params.id);
    const service = await serviceRepository.read(serviceIdd);

    // If the item is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the item in JSON format
    if (service == null) {
      res.sendStatus(404);
    } else {
      res.json(service);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The E of BREAD - Edit operation
const edit: RequestHandler = async (req, res, next) => {
  try {
    // Update a specific category based on the provided ID
    const service = {
      id: Number(req.params.id),
      statut: req.body.statut,
    };

    const affectedRows = await serviceRepository.update(service);

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

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    // Extract the item data from the request body
    const newService = {
      statut: req.body.statut,
    };

    // Create the service
    const insertId = await serviceRepository.create(newService);

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
    const serviceId = Number(req.params.id);

    await serviceRepository.delete(serviceId);

    // Respond with HTTP 204 (No Content) anyway
    res.sendStatus(204);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

export default { browse, read, add, edit, destroy };
