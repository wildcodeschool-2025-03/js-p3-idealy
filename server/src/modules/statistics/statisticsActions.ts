import type { RequestHandler } from "express";
import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

import type { RowDataPacket } from "mysql2";

// GET /api/statistics
export const getStatistics: RequestHandler = async (_req, res, next) => {
  try {
    // 1. Idées soumises ce mois-ci
    const [submittedResult] = await databaseClient.query<RowDataPacket[]>(
      `
        SELECT COUNT(*) AS submittedThisMonth
        FROM Idea
        WHERE MONTH(timestamp) = MONTH(CURRENT_DATE())
        AND YEAR(timestamp) = YEAR(CURRENT_DATE())
      `,
    );
    const submittedThisMonth = submittedResult[0]?.submittedThisMonth || 0;

    // 2. Likes (agree) ajoutés total
    const [likesResult] = await databaseClient.query<RowDataPacket[]>(
      `
        SELECT COUNT(*) AS likesAdded
        FROM Vote
        WHERE agree = 1        
      `,
    );
    const likesAdded = likesResult[0]?.likesAdded || 0;

    // 3. Idées validées total
    const [validatedResult] = await databaseClient.query<RowDataPacket[]>(
      `
        SELECT COUNT(*) AS ideasValidated
        FROM Idea
        INNER JOIN Statut ON Idea.statut_id = Statut.id
        WHERE Statut.statut = 'Validé'
      `,
    );
    const ideasValidated = validatedResult[0]?.ideasValidated || 0;

    res.status(200).json({ submittedThisMonth, likesAdded, ideasValidated });
  } catch (error) {
    next(error);
  }
};
