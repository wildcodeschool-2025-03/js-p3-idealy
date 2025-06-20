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

type User = {
  id: number;
  firstname?: string;
  lastname?: string;
  mail?: string;
  password?: string;
  picture?: string;
  isAdmin?: boolean;
  service_id?: number;
};

type VoteInformation = {
  agree_count: number;
  disagree_count: number;
};

type Category = {
  category: string;
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

  // Read all ideas, with an optional sort parameter
  // If sort is "recent", it returns the 3 most recent ideas

  async readAll({
    user_id,
    statut,
    sort,
  }: { user_id?: number; statut?: number; sort?: string }) {
    let sql = "SELECT * FROM Idea";
    const params: (string | number)[] = [];
    const where: string[] = []; // On prépare un tableau pour les conditions

    if (user_id) {
      sql += " JOIN User_idea ui ON ui.idea_id = Idea.id";
      where.push("ui.user_id = ?");
      params.push(user_id);
      where.push("ui.isCreator = TRUE"); // On ajoute la condition pour l'utilisateur créateur
    }
    if (statut) {
      where.push("statut_id = ?");
      params.push(statut);
    }
    if (where.length > 0) {
      sql += ` WHERE ${where.join(" AND ")}`;
    }
    if (sort === "recent") {
      sql += " ORDER BY timestamp DESC LIMIT 3";
    }

    const [rows] = await databaseClient.query(sql, params);

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

  // Specific functions

  // Execute the SQL SELECT query to retrieve the original creator of an idea, given the ID of the idea
  async getCreatorOfThisIdea(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT * FROM User u
     JOIN User_idea ui ON u.id = ui.user_id
     WHERE ui.idea_id = ? AND ui.isCreator = TRUE`,
      [id],
    );

    // Return the first row of the result, which represents the item
    return rows[0] as User;
  }

  // Execute the SQL SELECT query to retrieve the votes information of an idea, given the ID of the idea
  async getVotesInformationsOfThisIdea(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT
      (SELECT COUNT(*) FROM Vote WHERE idea_id = ? AND agree = TRUE) AS agree_count,
      (SELECT COUNT(*) FROM Vote WHERE idea_id = ? AND disagree = TRUE) AS disagree_count;`,
      [id, id],
    );

    // Return the first row of the result, which represents the item
    return rows[0] as VoteInformation;
  }

  // Execute the SQL SELECT query to retrieve the categories of an idea, given the ID of the idea
  async getCategoriesOfThisIdea(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT c.category FROM Category c
      JOIN Category_idea ci ON c.id = ci.category_id
      WHERE ci.idea_id = ?`,
      [id],
    );

    // Return the array of categories
    return rows as Category[];
  }
}

export default new IdeaRepository();
