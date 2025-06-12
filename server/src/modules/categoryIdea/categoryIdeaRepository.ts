import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

// Représente un lien entre une idée et une catégorie
export type CategoryIdea = {
  id: number;
  category_id: number;
  idea_id: number;
};

class CategoryIdeaRepository {
  /**
   * Crée un lien entre une catégorie et une idée
   * @param categoryId - Identifiant de la catégorie
   * @param ideaId - Identifiant de l'idée
   * @returns insertId du lien créé
   */
  async link(categoryId: number, ideaId: number): Promise<number> {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO category_idea (category_id, idea_id) VALUES (?, ?)",
      [categoryId, ideaId],
    );
    return result.insertId;
  }

  /**
   * Supprime le lien entre une catégorie et une idée
   * @param categoryId - Identifiant de la catégorie
   * @param ideaId - Identifiant de l'idée
   * @returns true si une ligne a été supprimée
   */
  async unlink(categoryId: number, ideaId: number): Promise<boolean> {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM category_idea WHERE category_id = ? AND idea_id = ?",
      [categoryId, ideaId],
    );
    return result.affectedRows > 0;
  }

  /**
   * Récupère toutes les catégories liées à une idée
   * @param ideaId - Identifiant de l'idée
   * @returns Liste des catégories
   */
  async findCategoriesForIdea(
    ideaId: number,
  ): Promise<{ id: number; category: string }[]> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT c.id, c.category " +
        "FROM category c " +
        "JOIN category_idea ci ON ci.category_id = c.id " +
        "WHERE ci.idea_id = ?",
      [ideaId],
    );
    return rows as { id: number; category: string }[];
  }

  /**
   * Récupère toutes les idées liées à une catégorie
   * @param categoryId - Identifiant de la catégorie
   * @returns Liste des idées
   */
  async findIdeasForCategory(
    categoryId: number,
  ): Promise<{ id: number; title: string }[]> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT i.id, i.title " +
        "FROM idea i " +
        "JOIN category_idea ci ON ci.idea_id = i.id " +
        "WHERE ci.category_id = ?",
      [categoryId],
    );
    return rows as { id: number; title: string }[];
  }

  /**
   * Récupère tous les liens catégorie-idée
   */
  async readAll(): Promise<CategoryIdea[]> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM category_idea",
    );
    return rows as CategoryIdea[];
  }
}

export default new CategoryIdeaRepository();
