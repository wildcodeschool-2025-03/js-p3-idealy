import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Service = {
  id: number;
  statut: string;
};

class ServiceRepository {
  // The C of CRUD - Create operation

  async create(service: Omit<Service, "id">) {
    // Execute the SQL INSERT query to add a new service to the "Service" table
    const [result] = await databaseClient.query<Result>(
      "insert into Service (statut) values (?)",
      [service.statut],
    );

    // Return the ID of the newly inserted service
    return result.insertId;
  }

  async readByName(serviceName: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM Service WHERE statut = ?",
      [serviceName],
    );
    return rows[0];
  }

  // The Rs of CRUD - Read operations

  async read(id: number) {
    // Execute the SQL SELECT query to retrieve a specific service by its ID
    const [rows] = await databaseClient.query<Rows>(
      "select * from Service where id = ?",
      [id],
    );

    // Return the first row of the result, which represents the item
    return rows[0] as Service;
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all items from the "Service" table
    const [rows] = await databaseClient.query<Rows>("select * from Service");

    // Return the array of items
    return rows as Service[];
  }

  // The U of CRUD - Update operation

  async update(service: Service) {
    // Execute the SQL UPDATE query to update an existing category in the "Service" table
    const [result] = await databaseClient.query<Result>(
      "update Service set statut = ? where id = ?",
      [service.statut, service.id],
    );

    // Return how many rows were affected
    return result.affectedRows;
  }

  // The D of CRUD - Delete operation

  async delete(id: number) {
    // Execute the SQL DELETE query to delete an existing service from the "Service" table
    const [result] = await databaseClient.query<Result>(
      "delete from Service where id = ?",
      [id],
    );

    // Return how many rows were affected
    return result.affectedRows;
  }
}

export default new ServiceRepository();
