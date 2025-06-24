// server/src/modules/statistics/statisticsActions.ts
import type { RequestHandler } from "express";
import statisticsRepository from "./statisticsRepository";

export const getStatistics: RequestHandler = async (_req, res, next) => {
  try {
    const submittedThisMonth =
      await statisticsRepository.countIdeasSubmittedThisMonth();
    const likesAdded = await statisticsRepository.countLikesAdded();
    const ideasValidated = await statisticsRepository.countIdeasValidated();

    res.status(200).json({ submittedThisMonth, likesAdded, ideasValidated });
  } catch (error) {
    next(error);
  }
};
