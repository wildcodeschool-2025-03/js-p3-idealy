import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Idea = {
  id: number;
  title: string;
  description: string;
  deadline: string;
  timestamp: string;
  statut_id: number;
};

class IdeaRepository {
  // The C of CRUD - Create operation

  async create(idea: Omit<Idea, "id" | "timestamp">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO Idea (title, description, deadline, statut_id) VALUES (?, ?, ?, ?)",
      [idea.title, idea.description, idea.deadline, idea.statut_id],
    );

    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM Idea WHERE id = ?",
      [id],
    );

    return rows[0] as Idea;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM Idea");

    return rows as Idea[];
  }

  // The U of CRUD - Update operation

  async update(id: number, idea: Omit<Idea, "id" | "timestamp">) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE Idea SET title = ?, description = ?, deadline = ?, statut_id = ? WHERE id = ?",
      [idea.title, idea.description, idea.deadline, idea.statut_id, id],
    );

    return result.affectedRows > 0;
  }

  // The D of CRUD - Delete operation

  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM Idea WHERE id = ?",
      [id],
    );

    return result.affectedRows > 0;
  }
}

export default new IdeaRepository();
