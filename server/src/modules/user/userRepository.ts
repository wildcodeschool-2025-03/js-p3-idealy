import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

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

class UserRepository {
  // The C of CRUD - Create operation

  async create(user: Omit<User, "id">) {
    // Execute the SQL INSERT query to add a new user to the "User" table
    const [result] = await databaseClient.query<Result>(
      "insert into User (firstname, lastname, mail, password, picture, isAdmin, service_id) values (?, ?, ?, ?, ?, ?, ?)",
      [
        user.firstname,
        user.lastname,
        user.mail,
        user.password,
        user.picture,
        user.isAdmin,
        user.service_id,
      ],
    );

    // Return the ID of the newly inserted service
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id: number) {
    // Execute the SQL SELECT query to retrieve a specific user by its ID
    const [rows] = await databaseClient.query<Rows>(
      "select * from User where id = ?",
      [id],
    );

    // Return the first row of the result, which represents the item
    return rows[0] as User;
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all items from the "User" table
    const [rows] = await databaseClient.query<Rows>("select * from User");

    // Return the array of items
    return rows as User[];
  }

  // The D of CRUD - Delete operation

  async delete(id: number) {
    // Execute the SQL DELETE query to delete an existing user from the "User" table
    const [result] = await databaseClient.query<Result>(
      "delete from User where id = ?",
      [id],
    );

    // Return how many rows were affected
    return result.affectedRows;
  }

  // The U of CRUD - Update operation

  async updateFirstname(user: User) {
    // Execute the SQL UPDATE query to update an existing user in the "User" table
    const [result] = await databaseClient.query<Result>(
      "update User set firstname = ? where id = ?",
      [user.firstname, user.id],
    );

    // Return how many rows were affected
    return result.affectedRows;
  }

  async updateLastname(user: User) {
    // Execute the SQL UPDATE query to update an existing user in the "User" table
    const [result] = await databaseClient.query<Result>(
      "update User set lastname = ? where id = ?",
      [user.lastname, user.id],
    );

    // Return how many rows were affected
    return result.affectedRows;
  }

  async updateMail(user: User) {
    // Execute the SQL UPDATE query to update an existing user in the "User" table
    const [result] = await databaseClient.query<Result>(
      "update User set mail = ? where id = ?",
      [user.mail, user.id],
    );

    // Return how many rows were affected
    return result.affectedRows;
  }

  async updatePassword(user: User) {
    // Execute the SQL UPDATE query to update an existing user in the "User" table
    const [result] = await databaseClient.query<Result>(
      "update Service set password = ? where id = ?",
      [user.password, user.id],
    );

    // Return how many rows were affected
    return result.affectedRows;
  }

  async updatePicture(user: User) {
    // Execute the SQL UPDATE query to update an existing user in the "User" table
    const [result] = await databaseClient.query<Result>(
      "update User set picture = ? where id = ?",
      [user.picture, user.id],
    );

    // Return how many rows were affected
    return result.affectedRows;
  }

  async updateService(user: User) {
    // Execute the SQL UPDATE query to update an existing user in the "User" table
    const [result] = await databaseClient.query<Result>(
      "update User set service_id = ? where id = ?",
      [user.service_id, user.id],
    );

    // Return how many rows were affected
    return result.affectedRows;
  }

  async authenticate(mail: string, password: string) {
    // Execute the SQL SELECT query to authenticate a user by mail and password
    const [rows] = await databaseClient.query<Rows>(
      "select * from User where mail = ? and password = ?",
      [mail, password],
    );

    // Return the first row of the result, which represents the authenticated user
    return rows[0] as User | undefined;
  }
}

export default new UserRepository();
