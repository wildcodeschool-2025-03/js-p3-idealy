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

type IdeaUpdate = {
  id: number;
  title: string;
  description: string;
  deadline: string;
  statut_id: number;
  justification?: string;
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
    toValidate,
  }: {
    user_id?: number;
    statut?: number;
    sort?: string;
    toValidate?: boolean;
  }) {
    let sql: string;
    const params: (string | number)[] = [];
    const where: string[] = [];

    if (toValidate) {
      sql = `SELECT Idea.*, u.firstname, u.lastname, u.mail as email
           FROM Idea
           JOIN User_idea ui ON ui.idea_id = Idea.id AND ui.isCreator = TRUE
           JOIN User u ON u.id = ui.user_id`;
      where.push("Idea.statut_id = 1");
      where.push("Idea.deadline <= CURDATE()");
    } else if (user_id) {
      sql = `SELECT Idea.* FROM Idea
           JOIN User_idea ui ON ui.idea_id = Idea.id`;
      where.push("ui.user_id = ?");
      params.push(user_id);
      where.push("ui.isCreator = TRUE");
    } else {
      sql = "SELECT * FROM Idea";
    }

    if (statut) {
      where.push("Idea.statut_id = ?");
      params.push(statut);
    }

    if (where.length > 0) {
      sql += ` WHERE ${where.join(" AND ")}`;
    }

    if (sort === "recent") {
      sql += " ORDER BY timestamp DESC LIMIT 3";
    } else if (toValidate) {
      sql += " ORDER BY Idea.timestamp DESC";
    }

    const [rows] = await databaseClient.query<Rows>(sql, params);
    return rows;
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

  //admin page valider refuser supprimer une idée

  async putValidationOrRefusal(idea: IdeaUpdate) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE Idea SET title = ?, description = ?, deadline = ?, statut_id = ?, justification = ? WHERE id = ?",
      [
        idea.title,
        idea.description,
        idea.deadline,
        idea.statut_id,
        idea.justification,
        idea.id,
      ],
    );
    return result.affectedRows > 0;
  }

  async deleteIdea(ideaId: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM Idea WHERE id = ?",
      [ideaId],
    );
    return result.affectedRows > 0;
  }

  async readHistory() {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM Idea WHERE statut_id IN (2, 3) ORDER BY timestamp DESC",
    );
    return rows;
  }

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

  async getParticipantsOfThisIdea(ideaId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT User.firstname, User.lastname, User.picture FROM User_idea JOIN User ON User_idea.user_id = User.id WHERE User_idea.idea_id = ? AND User.id != 2",
      [ideaId],
    );
    return rows as User[];
  }

  async getMediasOfThisIdea(ideaId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM Media WHERE idea_id = ?",
      [ideaId],
    );
    return rows;
  }

  // Transfer all ideas from a user to user_id=2
  async transferToUser2(fromUserId: number) {
    // First, get all ideas where the user is creator
    const [rows] = await databaseClient.query<Rows>(
      "SELECT idea_id FROM User_idea WHERE user_id = ? AND isCreator = TRUE",
      [fromUserId],
    );

    // For each idea, ensure user_id=2 has a creator link
    for (const row of rows) {
      // Check if user_id=2 already has a link with this idea
      const [existingRows] = await databaseClient.query<Rows>(
        "SELECT id FROM User_idea WHERE user_id = 2 AND idea_id = ?",
        [row.idea_id],
      );

      if (existingRows.length === 0) {
        // Create new creator link for user_id=2
        await databaseClient.query(
          "INSERT INTO User_idea (user_id, idea_id, isCreator) VALUES (2, ?, TRUE)",
          [row.idea_id],
        );
      } else {
        // Update existing link to make user_id=2 the creator
        await databaseClient.query(
          "UPDATE User_idea SET isCreator = TRUE WHERE user_id = 2 AND idea_id = ?",
          [row.idea_id],
        );
      }
    }

    // Note: The original user's links will be automatically deleted when the user is deleted
    // due to the ON DELETE CASCADE constraint
  }

  // Utility method to fix orphaned ideas (ideas without a creator)
  async fixOrphanedIdeas() {
    // Find all ideas that don't have a creator
    const [orphanedIdeas] = await databaseClient.query<Rows>(`
      SELECT i.id 
      FROM Idea i 
      LEFT JOIN User_idea ui ON i.id = ui.idea_id AND ui.isCreator = TRUE 
      WHERE ui.id IS NULL
    `);

    let fixedCount = 0;
    for (const idea of orphanedIdeas) {
      // Assign user_id=2 as creator for orphaned ideas
      await databaseClient.query(
        "INSERT INTO User_idea (user_id, idea_id, isCreator) VALUES (2, ?, TRUE)",
        [idea.id],
      );
      fixedCount++;
    }

    return fixedCount;
  }
}

export default new IdeaRepository();
