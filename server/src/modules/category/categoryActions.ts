// server/src/modules/category/categoryRepository.ts

import type { RequestHandler } from "express";
import categoryRepository from "./categoryRepository";

// B - Browse all categories
const browse: RequestHandler = async (req, res, next) => {
  try {
    const items = await categoryRepository.readAll();
    res.json(items);
  } catch (err) {
    next(err);
  }
};

// R - Read a specific category by ID
const read: RequestHandler = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);
    const item = await categoryRepository.read(categoryId);

    if (item == null) {
      res.sendStatus(404);
    } else {
      res.json(item);
    }
  } catch (err) {
    next(err);
  }
};

// A - Add a new category
const add: RequestHandler = async (req, res, next) => {
  try {
    const newCategory = {
      category: req.body.category, // ✅ correspond à la colonne SQL
    };

    const insertId = await categoryRepository.create(newCategory);
    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

// E - Edit an existing category
const edit: RequestHandler = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);

    const updatedCategory = {
      id: categoryId,
      category: req.body.category, // ✅ correspond au bon champ
    };

    const success = await categoryRepository.update(updatedCategory);

    if (!success) {
      res.sendStatus(404); // not found
    } else {
      res.sendStatus(204); // no content
    }
  } catch (err) {
    next(err);
  }
};

// D - Delete a category
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);
    const success = await categoryRepository.delete(categoryId);

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

