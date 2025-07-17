import databaseClient from "../../database/client";
import UserRepository from "../../src/modules/user/userRepository";

jest.mock("../../database/client");

describe("UserRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user", async () => {
    const mockInsertId = 1;
    (databaseClient.query as jest.Mock).mockResolvedValueOnce([
      { insertId: mockInsertId },
    ]);

    const user = {
      firstname: "John",
      lastname: "Doe",
      mail: "john.doe@example.com",
      password: "password123",
      picture: "profile.jpg",
      isAdmin: false,
      service_id: 2,
    };

    const result = await UserRepository.create(user);

    expect(databaseClient.query).toHaveBeenCalledWith(
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
    expect(result).toBe(mockInsertId);
  });

  it("should read a user by id", async () => {
    const mockUser = {
      id: 1,
      firstname: "John",
      lastname: "Doe",
      mail: "john.doe@example.com",
      password: "password123",
      picture: "profile.jpg",
      isAdmin: false,
      service_id: 2,
    };
    (databaseClient.query as jest.Mock).mockResolvedValueOnce([[mockUser]]);

    const result = await UserRepository.read(1);

    expect(databaseClient.query).toHaveBeenCalledWith(
      "select * from User where id = ?",
      [1],
    );
    expect(result).toEqual(mockUser);
  });

  it("should delete a user by id", async () => {
    const mockAffectedRows = 1;
    (databaseClient.query as jest.Mock).mockResolvedValueOnce([
      { affectedRows: mockAffectedRows },
    ]);

    const result = await UserRepository.delete(1);

    expect(databaseClient.query).toHaveBeenCalledWith(
      "delete from User where id = ?",
      [1],
    );
    expect(result).toBe(mockAffectedRows);
  });
});
