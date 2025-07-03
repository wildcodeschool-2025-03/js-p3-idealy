import type { RequestHandler } from "express";
import Joi from "joi";

// Schéma de validation pour les query de /api/ideas utilisée dans admin et principal
const ideaQuerySchema = Joi.object({
  sort: Joi.string().valid("recent"),
  user_id: Joi.number().integer(),
  statut: Joi.number().integer(),
  toValidate: Joi.number().integer(),
});

import type { NextFunction, Request, Response } from "express";

export const validateIdeaQuery = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = ideaQuerySchema.validate(req.query);
  if (error) {
    res.status(400).json({ error: error.details.map((d) => d.message) });
    return;
  }
  next();
};

export const validateIdeaUpdate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    deadline: Joi.string().required(),
    statut_id: Joi.number().valid(2, 3).required(),
    justification: Joi.string().min(5).max(250).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details.map((d) => d.message) });
    return;
  }
  next();
};

export const validateIdParam = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({ id: Joi.number().integer().required() });
  const { error } = schema.validate(req.params);
  if (error) {
    res.status(400).json({ error: error.details.map((d) => d.message) });
    return;
  }
  next();
};
