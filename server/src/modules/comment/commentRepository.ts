import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Comment = {
  id: number;
  content: string;
  idea_id: number;
  user_id: number;
};

class CommentRepository {
  // The C of CRUD - Create operation

  async create(comment: Omit<Comment, "id">) {
    // Execute the SQL INSERT query to add a new comment to the "comment" table
    const [result] = await databaseClient.query<Result>(
      "insert into comment (content, idea_id, user_id) values (?, ?, ?)",
      [comment.content, comment.idea_id, comment.user_id],
    );

    // Return the ID of the newly inserted comment
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async getCommentsForIdea(ideaId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM Comment WHERE idea_id = ? ORDER BY created_at DESC", // selectionne tout depuis la table Comment ou l'id de l'idée = placeholder (remplacé par [ideaID]) ordonné par timestamp décroissant
      [ideaId],
    );
    return rows as Comment[]; // renvoi le tableau complet
  }

  // The U of CRUD - Update operation

  // Transfer all comments from a user to user_id=2
  async transferToUser2(fromUserId: number) {
    await databaseClient.query(
      "UPDATE Comment SET user_id = 2 WHERE user_id = ?",
      [fromUserId],
    );
  }
}

export default new CommentRepository();
