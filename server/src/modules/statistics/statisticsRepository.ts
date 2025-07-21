// server/src/modules/statistics/statisticsRepository.ts
import type { RowDataPacket } from "mysql2";
import databaseClient from "../../../database/client";

async function countIdeasSubmittedThisMonth(): Promise<number> {
  const [rows] = await databaseClient.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS count
     FROM Idea
     WHERE MONTH(timestamp) = MONTH(CURRENT_DATE())
     AND YEAR(timestamp) = YEAR(CURRENT_DATE())`,
  );
  return rows[0]?.count || 0;
}

async function countLikesAdded(): Promise<number> {
  const [rows] = await databaseClient.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS count
     FROM Vote
     WHERE agree = 1
     AND YEAR(timestamp) = YEAR(CURRENT_DATE())`,
  );
  return rows[0]?.count || 0;
}

async function countIdeasValidated(): Promise<number> {
  const [rows] = await databaseClient.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS count
     FROM Idea
     INNER JOIN Statut ON idea.statut_id = Statut.id
     WHERE Statut.statut = 'Validé'     
      AND YEAR(idea.timestamp) = YEAR(CURRENT_DATE())`,
  );
  return rows[0]?.count || 0;
}

export default {
  countIdeasSubmittedThisMonth,
  countLikesAdded,
  countIdeasValidated,
};
