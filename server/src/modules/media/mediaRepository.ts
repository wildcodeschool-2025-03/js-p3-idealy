import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Media = {
  id: number;
  url: string;
  type: "image" | "video";
  idea_id: number;
};

class MediaRepository {
  // The C of CRUD - Create operation

  async create(media: Omit<Media, "id">) {
    // Execute the SQL INSERT query to add a new media to the "media" table
    const [result] = await databaseClient.query<Result>(
      "insert into media (url, type, idea_id) values (?, ?, ?)",
      [media.url, media.type, media.idea_id],
    );

    // Return the ID of the newly inserted media
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id: number) {
    // Execute the SQL SELECT query to retrieve a specific media by its ID
    const [rows] = await databaseClient.query<Rows>(
      "select * from media where id = ?",
      [id],
    );

    // Return the first row of the result, which represents the media
    return rows[0] as Media;
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all media from the "media" table
    const [rows] = await databaseClient.query<Rows>("select * from media");

    // Return the array of media
    return rows as Media[];
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing media

  async update(media: Media) {
    // Execute the SQL UPDATE query to update an existing media in the "media" table
    const [result] = await databaseClient.query<Result>(
      "update media set url = ?, type = ?, idea_id = ? where id = ?",
      [media.url, media.type, media.idea_id, media.id],
    );

    // Return how many rows were affected
    return result.affectedRows;
  }

  // The D of CRUD - Delete operation
  async delete(id: number) {
    // Execute the SQL DELETE query to remove a media by its ID
    const [result] = await databaseClient.query<Result>(
      "delete from media where id = ?",
      [id],
    );

    // Return how many rows were affected
    return result.affectedRows;
  }
}

export default new MediaRepository();
