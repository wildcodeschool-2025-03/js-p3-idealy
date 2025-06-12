import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Vote = {
  id: number;
  agree: number;
  disagree: number;
  timestamp: string;
  idea_id: number;
  user_id: number;
};

class VoteRepository {
  // The C of CRUD - Create operation

  async create(vote: Omit<Vote, "id" | "timestamp">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO Vote (agree, disagree, idea_id, user_id) VALUES (?, ?, ?, ?)",
      [vote.agree, vote.disagree, vote.idea_id, vote.user_id],
    );

    return result.insertId;
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

  // The U of CRUD - Update operation

  // The D of CRUD - Delete operation
}

export default new VoteRepository();
