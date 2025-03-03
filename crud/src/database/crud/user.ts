import { compareSync } from "bcrypt-ts";

import pool from "../database.js";
import { User } from "../../models/user.js";
import NotFoundError from "../../models/errors/not-found-error.js";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";


export async function getAllUsers() {
  let users: Array<User> = [];
  const [dbUsers] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM user'
  );
  dbUsers.forEach(dbUser => {
    const user: User = new User(dbUser.id, dbUser.email, dbUser.username, dbUser.password);
    users.push(user);
  });
  return users;
}

export async function getUser(id: number): Promise<User> {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM user WHERE id = ?', [id]);
  if (rows.length > 0) {
    const dbUser = rows[0];
    const user: User = new User(dbUser.id, dbUser.email, dbUser.username, dbUser.password);
    return user;
  } else {
    throw new NotFoundError({ message: "No user with this ID found.", logging: true });
  }
}

export async function logIn(username: string, password: string): Promise<User> {
  // Query the database for the user using the username
  const [dbUsers] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM user WHERE username = ?',
    [username]
  );

  if (dbUsers.length === 0) {
    throw new NotFoundError({ message: "Wrong credentials.", logging: true });
  }

  const dbUser = dbUsers[0];

  // Debug logging - remove or mask sensitive details in production!
  console.log(`Provided password: ${password}, Hashed password: ${dbUser.password}`);

  if (!compareSync(password, dbUser.password)) {
    throw new NotFoundError({ message: "Wrong credentials.", logging: true });
  }

  const user: User = new User(dbUser.id, dbUser.email, dbUser.username, dbUser.password);
  return user;
}

export async function createUser(email: string, username: string, password: string): Promise<User> {
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO user (email, username, password) VALUES (?, ?, ?)',
    [email, username, password]
  );
  const insertedId = result.insertId;
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM user WHERE id = ?',
    [insertedId]
  );
  const dbUser = rows[0];
  const user: User = new User(dbUser.id, dbUser.email, dbUser.username, dbUser.password);
  return user;
}

export async function deleteUser(id: number): Promise<User> {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM user WHERE id = ?', [id]);
  if (rows.length > 0) {
    const dbUser = rows[0];
    await pool.execute('DELETE FROM user WHERE id = ?', [id]);
    const user: User = new User(dbUser.id, dbUser.email, dbUser.username, dbUser.password);
    return user;
  } else {
    throw new NotFoundError({ message: "User not found.", logging: true });
  }
}

export async function updateUser(id: number, email: string, username: string, password: string): Promise<User> {
  const [result] = await pool.execute<ResultSetHeader>(
    'UPDATE user SET email = ?, username = ?, password = ? WHERE id = ?',
    [email, username, password, id]
  );
  if (result.affectedRows > 0) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM user WHERE id = ?',
      [id]
    );
    const dbUser = rows[0];
    const user: User = new User(dbUser.id, dbUser.email, dbUser.username, dbUser.password);
    return user;
  } else {
    throw new NotFoundError({ message: "User not found.", logging: true });
  }
}