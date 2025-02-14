import sql from "../database.js";

export async function addGameType(name: string, description: string) {
  try {
    return await sql`INSERT INTO game_type (name, description) VALUES (${name}, ${description}) returning *;`;
  } catch (error) {
    return await error;
  } 
}

export async function removeGameType(id: number) {
    try {
      return await sql`DELETE FROM game_type WHERE id = ${id} returning *;`;
    } catch (error) {
      return await error;
    } 
}

export async function listGameTypes() {
    try {
      return await sql`SELECT * FROM game_type;`;
    } catch (error) {
      return await error;
    } 
}


