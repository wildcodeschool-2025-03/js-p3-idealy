// server/src/modules/statut/statutRepository.ts

import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

// Correspond à la structure réelle de la table `statut`
type Statut = {
  id: number;
  statut: string; // ENUM: 'En cours', 'Validé', 'Refusé'
  timestamp: Date; // généré automatiquement par la BDD
};

class StatutRepository {
  // C - Create
  async create(statut: Omit<Statut, "id" | "timestamp">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO statut (statut) VALUES (?)",
      [statut.statut],
    );
    return result.insertId;
  }

  // R - Read One
  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM statut WHERE id = ?",
      [id],
    );
    return rows[0] as Statut;
  }

  // R - Read All
  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM statut");
    return rows as Statut[];
  }

  // U - Update
  async update(statut: Omit<Statut, "timestamp">) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE statut SET statut = ? WHERE id = ?",
      [statut.statut, statut.id],
    );
    return result.affectedRows > 0;
  }

  // D - Delete
  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM statut WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  }
}

export default new StatutRepository();
