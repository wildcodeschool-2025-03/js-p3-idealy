// server/src/modules/category/categoryRepository.ts

import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Category = {
  id: number;
  category: string; // correspond à la colonne 'category' en base
};

class CategoryRepository {
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
}

export default new CategoryRepository();
