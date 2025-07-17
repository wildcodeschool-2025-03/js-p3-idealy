import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type User = {
  id: number;
  firstname?: string;
  lastname?: string;
  mail?: string;
  password?: string;
  passHash?: string;
  picture?: string;
  isAdmin?: boolean;
  service_id?: number;
  service?: string;
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
        user.passHash,
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

  async update(user: User) {
    // Requete 1 = Mise à jour avec mot de passe si fourni
    if (user.password) {
      const [result] = await databaseClient.query<Result>(
        "UPDATE User SET firstname = ?, lastname = ?, mail = ?, service_id = ?, password = ? WHERE id = ?",
        [
          user.firstname,
          user.lastname,
          user.mail,
          user.service_id,
          user.password,
          user.id,
        ],
      );
      return result.affectedRows;
    }

    // Requete 2 = Mise à jour sans mot de passe
    const [result] = await databaseClient.query<Result>(
      "UPDATE User SET firstname = ?, lastname = ?, mail = ?, service_id = ? WHERE id = ?",
      [user.firstname, user.lastname, user.mail, user.service_id, user.id], // valeurs à injecter dans les placeholders
    );
    return result.affectedRows;
  }

  async getServiceOfThisUser(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT s.statut AS service_name FROM User u JOIN Service s ON u.service_id = s.id WHERE u.id = ?",
      [userId],
    );

    return rows[0];
  }

  // Check if an email already exists in the database
  async emailExists(mail: string): Promise<boolean> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id FROM User WHERE mail = ?",
      [mail],
    );
    return rows.length > 0;
  }

  async authenticate(mail: string, password: string) {
    // Execute the SQL SELECT query to authenticate a user by mail and password
    const [rows] = await databaseClient.query<Rows>(
      "SELECT u.*, s.statut as service FROM User u LEFT JOIN Service s ON u.service_id = s.id WHERE u.mail = ? AND u.password = ?",
      [mail, password],
    );

    // Return the first row of the result, which represents the authenticated user
    return rows[0] as User | undefined;
  }

  async signIn(mail: string) {
    // Execute the SQL SELECT query to authenticate a user by mail only
    const [rows] = await databaseClient.query<Rows>(
      "SELECT u.*, s.statut as service FROM User u LEFT JOIN Service s ON u.service_id = s.id WHERE u.mail = ?",
      [mail],
    );

    // Return the first row of the result, which represents the authenticated user
    return rows[0] as User | undefined;
  }
}

export default new UserRepository();
