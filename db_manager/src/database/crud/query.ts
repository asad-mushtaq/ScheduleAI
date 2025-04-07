import pool from "../database.js";
import { Query } from "../../models/query.js";
import NotFoundError from "../../models/errors/not-found-error.js";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export async function getAllQueries() {
    let queries: Array<Query> = [];
    const [dbQueries] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM query'
    );
    dbQueries.forEach(dbQuery => {
        const query: Query = new Query(
            dbQuery.id,
            dbQuery.user_id,
            new Date(dbQuery.date),
            dbQuery.prompt,
            dbQuery.response
        );
        queries.push(query);
    });
    return queries;
}

export async function getQuery(id: number): Promise<Query> {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM query WHERE id = ?',
        [id]
    );
    if (rows.length > 0) {
        const dbQuery = rows[0];
        const query: Query = new Query(
            dbQuery.id,
            dbQuery.user_id,
            new Date(dbQuery.date),
            dbQuery.prompt,
            dbQuery.response
        );
        return query;
    } else {
        throw new NotFoundError({ message: "No query with this ID found.", logging: true });
    }
}

export async function createQuery(prompt: string, response: string, userId: number): Promise<Query> {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO query (prompt, response, user_id) VALUES (?, ?, ?)',
        [prompt, response, userId]
    );
    const insertedId = result.insertId;
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM query WHERE id = ?',
        [insertedId]
    );
    const dbQuery = rows[0];
    const query: Query = new Query(
        dbQuery.id,
        dbQuery.user_id,
        new Date(dbQuery.date),
        dbQuery.prompt,
        dbQuery.response
    );
    return query;
}

export async function deleteQuery(id: number): Promise<Query> {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM query WHERE id = ?',
        [id]
    );
    if (rows.length > 0) {
        const dbQuery = rows[0];
        await pool.execute('DELETE FROM query WHERE id = ?', [id]);
        const query: Query = new Query(
            dbQuery.id,
            dbQuery.user_id,
            new Date(dbQuery.date),
            dbQuery.prompt,
            dbQuery.response
        );
        return query;
    } else {
        throw new NotFoundError({ message: "Query not found.", logging: true });
    }
}

export async function updateQuery(id: number, prompt: string, response: string): Promise<Query> {
    const [result] = await pool.execute<ResultSetHeader>(
        'UPDATE query SET prompt = ?, response = ? WHERE id = ?',
        [prompt, response, id]
    );
    if (result.affectedRows > 0) {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM query WHERE id = ?',
            [id]
        );
        const dbQuery = rows[0];
        const query: Query = new Query(
            dbQuery.id,
            dbQuery.user_id,
            new Date(dbQuery.date),
            dbQuery.prompt,
            dbQuery.response
        );
        return query;
    } else {
        throw new NotFoundError({ message: "Query not found.", logging: true });
    }
}
