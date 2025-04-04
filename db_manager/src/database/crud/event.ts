import { compareSync } from "bcrypt-ts";

import pool from "../database.js";
import { Event } from "../../models/event.js";
import NotFoundError from "../../models/errors/not-found-error.js";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Task } from "../../models/task.js";


export async function getAllEvents() {
  let events: Array<Event> = [];
  const [dbEvents] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM event'
  );
  dbEvents.forEach(dbEvent => {
    const event: Event = new Event(dbEvent.id, dbEvent.user_id, dbEvent.name, dbEvent.description, dbEvent.start_date, dbEvent.length, dbEvent.completed);
    events.push(event);
  });
  return events;
}

export async function getEvent(id: number): Promise<Event> {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM event WHERE id = ?', [id]);
  if (rows.length > 0) {
    const dbEvent = rows[0];
    const event: Event = new Event(dbEvent.id, dbEvent.user_id, dbEvent.name, dbEvent.description, dbEvent.start_date, dbEvent.length, dbEvent.completed);
    return event;
  } else {
    throw new NotFoundError({ message: "No event with this ID found.", logging: true });
  }
}

export async function getEventTasks(eventId: number): Promise<Array<Task>> {
  let tasks: Array<Task> = [];
  const [dbTasks] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM task WHERE event_id = ?',
    [eventId]
  );
  dbTasks.forEach(dbTask => {
    const query: Task = new Task(
      dbTask.id,
      dbTask.name,
      dbTask.description,
      dbTask.completed,
      dbTask.event_id
    );
    tasks.push(query);
  });
  return tasks;
}

export async function createEvent(userId: number, name: string, description: string, startDate: Date, length: number): Promise<Event> {
  console.log(userId, name, description, startDate, length)
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO event (user_id, name, description, start_date, length) VALUES (?, ?, ?, ?, ?)',
    [userId, name, description, startDate, length]
  );
  const insertedId = result.insertId;
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM event WHERE id = ?',
    [insertedId]
  );
  const dbEvent = rows[0];
  const event: Event = new Event(dbEvent.id, dbEvent.user_id, dbEvent.name, dbEvent.description, dbEvent.start_date, dbEvent.length, dbEvent.completed);
  return event;
}

export async function deleteEvent(id: number): Promise<Event> {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM event WHERE id = ?', [id]);
  if (rows.length > 0) {
    const dbEvent = rows[0];
    await pool.execute('DELETE FROM task WHERE event_id IN (SELECT id FROM event);');
    await pool.execute('DELETE FROM event WHERE id = ?', [id]);
    const event: Event = new Event(dbEvent.id, dbEvent.user_id, dbEvent.name, dbEvent.description, dbEvent.start_date, dbEvent.length, dbEvent.completed);
    return event;
  } else {
    throw new NotFoundError({ message: "Event not found.", logging: true });
  }
}

export async function updateEvent(id: number, name: string, description: string, startDate: Date, length: number): Promise<Event> {
  const [result] = await pool.execute<ResultSetHeader>(
    'UPDATE event SET name = ?, description = ?, start_date = ?, length  = ? WHERE id = ?',
    [name, description, startDate, length, id]
  );
  if (result.affectedRows > 0) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM event WHERE id = ?',
      [id]
    );
    const dbEvent = rows[0];
    const event: Event = new Event(dbEvent.id, dbEvent.user_id, dbEvent.name, dbEvent.description, dbEvent.start_date, dbEvent.length, dbEvent.completed);
    return event;
  } else {
    throw new NotFoundError({ message: "Event not found.", logging: true });
  }
}