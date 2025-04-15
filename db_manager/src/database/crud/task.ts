import pool from "../database.js";
import { Task } from "../../models/task.js";
import NotFoundError from "../../models/errors/not-found-error.js";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export async function getAllTasks() {
    let tasks: Array<Task> = [];
    const [dbTasks] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM task'
    );
    dbTasks.forEach(dbTask => {
        const task: Task = new Task(
            dbTask.id,
            dbTask.name,
            dbTask.description,
            dbTask.completed,
            dbTask.event_id
        );
        tasks.push(task);
    });
    return tasks;
}

export async function getTask(id: number): Promise<Task> {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM task WHERE id = ?',
        [id]
    );
    if (rows.length > 0) {
        const dbTask = rows[0];
        const task: Task = new Task(
            dbTask.id,
            dbTask.name,
            dbTask.description,
            dbTask.completed,
            dbTask.event_id
        );
        return task;
    } else {
        throw new NotFoundError({ message: "No task with this ID found.", logging: true });
    }
}

export async function createTask(name: string, description: string, completed: boolean, eventId: number): Promise<Task> {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO task (name, description, completed, event_id) VALUES (?, ?, ?, ?)',
        [name, description, completed, eventId]
    );
    const insertedId = result.insertId;
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM task WHERE id = ?',
        [insertedId]
    );
    const dbTask = rows[0];
    const task: Task = new Task(
        dbTask.id,
        dbTask.name,
        dbTask.description,
        dbTask.completed,
        dbTask.event_id
    );
    return task;
}

export async function deleteTask(id: number): Promise<Task> {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM task WHERE id = ?',
        [id]
    );
    if (rows.length > 0) {
        const dbTask = rows[0];
        await pool.execute('DELETE FROM task WHERE id = ?', [id]);
        const task: Task = new Task(
            dbTask.id,
            dbTask.name,
            dbTask.description,
            dbTask.completed,
            dbTask.event_id
        );
        return task;
    } else {
        throw new NotFoundError({ message: "Task not found.", logging: true });
    }
}

export async function updateTask(id: number, name: string, description: string, completed: boolean): Promise<Task> {
    const [result] = await pool.execute<ResultSetHeader>(
        'UPDATE task SET name = ?, description = ?, completed = ? WHERE id = ?',
        [name, description, completed, id]
    );
    if (result.affectedRows > 0) {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM task WHERE id = ?',
            [id]
        );
        const dbTask = rows[0];
        const task: Task = new Task(
            dbTask.id,
            dbTask.name,
            dbTask.description,
            dbTask.completed,
            dbTask.event_id
        );
        return task;
    } else {
        throw new NotFoundError({ message: "Task not found.", logging: true });
    }
}
