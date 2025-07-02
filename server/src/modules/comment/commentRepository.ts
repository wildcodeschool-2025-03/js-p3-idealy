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

  async read(id: number) {
    // Execute the SQL SELECT query to retrieve a specific comment by its ID
    const [rows] = await databaseClient.query<Rows>(
      "select * from comment where id = ?",
      [id],
    );

    // Return the first row of the result, which represents the comment
    return rows[0] as Comment;
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all comments from the "comment" table
    const [rows] = await databaseClient.query<Rows>("select * from comment");

    // Return the array of comments
    return rows as Comment[];
  }

  async getCommentsForIdea(ideaId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM Comment WHERE idea_id = ? ORDER BY created_at DESC", // selectionne tout depuis la table Comment ou l'id de l'idée = placeholder (remplacé par [ideaID]) ordonné par timestamp décroissant
      [ideaId],
    );
    return rows as Comment[]; // renvoi le tableau complet
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing comment

  async update(comment: Comment) {
    // Execute the SQL UPDATE query to update an existing comment in the "comment" table
    const [result] = await databaseClient.query<Result>(
      "update comment set content = ?, idea_id = ?, user_id = ? where id = ?",
      [comment.content, comment.idea_id, comment.user_id, comment.id],
    );

    // Return how many rows were affected
    return result.affectedRows;
  }

  // The D of CRUD - Delete operation
  async delete(id: number) {
    // Execute the SQL DELETE query to remove a comment by its ID
    const [result] = await databaseClient.query<Result>(
      "delete from comment where id = ?",
      [id],
    );

    // Return how many rows were affected
    return result.affectedRows;
  }
}

export default new CommentRepository();
