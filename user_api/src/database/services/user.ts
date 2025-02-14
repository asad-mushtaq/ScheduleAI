import sql from "../database.js";
import { Role } from "../../models/role.js";
import { User } from "../../models/user.js";
import { Error } from "postgres";

export async function listUsers() {
    try {
      return await sql`SELECT * FROM _user;`;
    } catch (error) {
      return await error;
    } 
}

export async function getUser(id: number) {
  try {
    return await sql`SELECT * FROM _user WHERE id = ${id};`;
  } catch (error) {
    return await error;
  } 
}

export async function login(username: string, password: string): Promise<User | Error> {
  try {
    const dbUser = (await sql`SELECT * FROM _user WHERE (username = ${username} OR email = ${username}) AND password = ${password};`)[0];
    const user: User = new User(dbUser.id, dbUser.email, dbUser.username, dbUser.password, dbUser.xp, dbUser._role);
    return user;
  } catch (error: any) {
    return await error;
  } 
}

export async function createUser(email: string, username: string, password: string, role: Role): Promise<User> {

    const dbUser = (await sql`INSERT INTO _user (email, username, password, _role) VALUES (${email}, ${username}, ${password}, ${Role[role]}) returning *;`)[0];
    const user: User = new User(dbUser.id, dbUser.email, dbUser.username, dbUser.password, dbUser.xp, dbUser._role);
    return user;
}

export async function removeUser(id: number) {
  try {
    const dbUser = (await sql` DELETE FROM _user WHERE id = ${id} returning *;`)[0];
    const user: User = new User(dbUser.id, dbUser.email, dbUser.username, dbUser.password, dbUser.xp, dbUser._role);
    return user;
  } catch (error) {
    return await error;
  } 
}

export async function updateUser(id: number, email: string, username: string, password: string, role: Role) {
  try {
    const dbUser = (await sql` DELETE FROM _user WHERE id = ${id} returning *;`)[0];
    const user: User = new User(dbUser.id, dbUser.email, dbUser.username, dbUser.password, dbUser.xp, dbUser._role);
    return user;
  } catch (error) {
    return await error;
  } 
}