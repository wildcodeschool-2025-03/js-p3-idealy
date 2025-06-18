// server/src/modules/user/userIdeaRepository.ts

import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

// Représente un lien entre un utilisateur et une idée
export type UserIdea = {
  id: number;
  user_id: number;
  idea_id: number;
};

class UserIdeaRepository {
  // Créer un lien user → idée
  async link(userId: number, ideaId: number): Promise<number> {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO user_idea (user_id, idea_id) VALUES (?, ?)",
      [userId, ideaId],
    );
    return result.insertId;
  }

  // Supprimer un lien user → idée
  async unlink(userId: number, ideaId: number): Promise<boolean> {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM user_idea WHERE user_id = ? AND idea_id = ?",
      [userId, ideaId],
    );
    return result.affectedRows > 0;
  }

  // Lire tous les liens
  async readAll(): Promise<UserIdea[]> {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM user_idea");
    return rows as UserIdea[];
  }

  // Lire tous les participants d'une idée
  async findUsersForIdea(
    ideaId: number,
  ): Promise<{ id: number; firstname: string; lastname: string }[]> {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT u.id, u.firstname, u.lastname
       FROM user u
       JOIN user_idea ui ON ui.user_id = u.id
       WHERE ui.idea_id = ?`,
      [ideaId],
    );
    return rows as { id: number; firstname: string; lastname: string }[];
  }
}

export default new UserIdeaRepository();
