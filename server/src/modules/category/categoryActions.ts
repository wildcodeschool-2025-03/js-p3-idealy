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

export default { browse, read };
