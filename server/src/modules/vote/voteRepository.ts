import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Vote = {
  id?: number;
  agree: number;
  disagree: number;
  timestamp?: string;
  idea_id: number;
  user_id: number;
};

class VoteRepository {
  // The C of CRUD - Create operation

  // Si l'user n'a jamais voté pour l'idée en question
  async create(vote: Omit<Vote, "id" | "timestamp">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO Vote (agree, disagree, idea_id, user_id) VALUES (?, ?, ?, ?)",
      [vote.agree, vote.disagree, vote.idea_id, vote.user_id],
    );

    return result.insertId;
  }

  // Si l'user a déja voté pour l'idée en question
  async updateVote(vote: Vote) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE Vote SET agree = ?, disagree = ? WHERE idea_id = ? AND user_id = ?",
      [vote.agree, vote.disagree, vote.idea_id, vote.user_id],
    );
    return result.affectedRows;
  }

  // Vérifie si un user X a déja voté pour l'idée Y (pour fonction ci-dessus)
  async readByIdeaAndUser(idea_id: number, user_id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM Vote WHERE idea_id = ? AND user_id = ?",
      [idea_id, user_id],
    );
    return rows[0] as Vote | undefined;
  }

  // The Rs of CRUD - Read operations

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM Vote WHERE id = ?",
      [id],
    );

    return rows[0] as Vote;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM Vote");

    return rows as Vote[];
  }

  // Pour affichage correct des votes sur la carte
  async getVotesForIdeaWithUser(ideaId: number, userId?: number) {
    const [[totals]] = await databaseClient.query<Rows>(
      `SELECT 
      SUM(agree) AS agree_count, 
      SUM(disagree) AS disagree_count 
    FROM Vote 
    WHERE idea_id = ?`,
      [ideaId],
    );

    let user_vote = null;

    if (userId) {
      const [rows] = await databaseClient.query<Rows>(
        "SELECT agree, disagree FROM Vote WHERE idea_id = ? AND user_id = ?",
        [ideaId, userId],
      );
      if (rows.length > 0) {
        user_vote = {
          agree: !!rows[0].agree,
          disagree: !!rows[0].disagree,
        };
      }
    }

    return {
      agree_count: totals.agree_count ?? 0,
      disagree_count: totals.disagree_count ?? 0,
      user_vote,
    };
  }

  // The U of CRUD - Update operation

  // The D of CRUD - Delete operation

  // Delete all votes of a user
  async deleteByUserId(userId: number) {
    await databaseClient.query("DELETE FROM Vote WHERE user_id = ?", [userId]);
  }
}

export default new VoteRepository();
