// server/src/modules/category/categoryRepository.ts

import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Category = {
  id: number;
  category: string; // correspond à la colonne 'category' en base
};

class CategoryRepository {
  // C - Create
  async create(category: Omit<Category, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO category (category) VALUES (?)",
      [category.category],
    );
    return result.insertId;
  }

  // R - Read one
  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM category WHERE id = ?",
      [id],
    );
    return rows[0] as Category;
  }

  // R - Read all
  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM category");
    return rows as Category[];
  }

  // U - Update
  async update(category: Category) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE category SET category = ? WHERE id = ?",
      [category.category, category.id],
    );
    return result.affectedRows > 0;
  }

  // D - Delete
  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM category WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  }
}

export default new CategoryRepository();

