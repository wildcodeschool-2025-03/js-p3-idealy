// server/src/modules/statut/statutActions.ts

import type { RequestHandler } from "express";
import statutRepository from "./statutRepository";

// B - Browse all statuts
const browse: RequestHandler = async (req, res, next) => {
  try {
    const items = await statutRepository.readAll();
    res.json(items);
  } catch (err) {
    next(err);
  }
};

// R - Read a specific statut by ID
const read: RequestHandler = async (req, res, next) => {
  try {
    const statutId = Number(req.params.id);
    const item = await statutRepository.read(statutId);

    if (item == null) {
      res.sendStatus(404);
    } else {
      res.json(item);
    }
  } catch (err) {
    next(err);
  }
};

// A - Add a new statut
const add: RequestHandler = async (req, res, next) => {
  try {
    const newStatut = {
      statut: req.body.statut, // doit correspondre à l'ENUM de la table
    };

    const insertId = await statutRepository.create(newStatut);
    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

// E - Edit an existing statut
const edit: RequestHandler = async (req, res, next) => {
  try {
    const statutId = Number(req.params.id);

    const updatedStatut = {
      id: statutId,
      statut: req.body.statut,
    };

    const success = await statutRepository.update(updatedStatut);

    if (!success) {
      res.sendStatus(404); // not found
    } else {
      res.sendStatus(204); // no content
    }
  } catch (err) {
    next(err);
  }
};

// D - Delete a statut
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const statutId = Number(req.params.id);
    const success = await statutRepository.delete(statutId);

    if (!success) {
      res.sendStatus(404); // not found
    } else {
      res.sendStatus(204); // deleted successfully
    }
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add, edit, destroy };
