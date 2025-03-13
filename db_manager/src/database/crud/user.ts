import { compareSync } from "bcrypt-ts";

import pool from "../database.js";
import { User } from "../../models/user.js";
import { Event } from "../../models/event.js";
import NotFoundError from "../../models/errors/not-found-error.js";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Query } from "../../models/query.js";
import { Task } from "../../models/task.js";
import { Subscription } from "../../models/subscription.js";
import { getSubscription } from "./subscription.js";
import { Payment } from "../../models/payment.js";


export async function getAllUsers() {
  let users: Array<User> = [];
  const [dbUsers] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM user'
  );
  dbUsers.forEach(dbUser => {
    const user: User = new User(dbUser.id, dbUser.first_name, dbUser.last_name, dbUser.email, dbUser.password);
    users.push(user);
  });
  return users;
}

export async function getUser(id: number): Promise<User> {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM user WHERE id = ?', [id]);
  if (rows.length > 0) {
    const dbUser = rows[0];
    const user: User = new User(dbUser.id, dbUser.first_name, dbUser.last_name, dbUser.email, dbUser.password);
    return user;
  } else {
    throw new NotFoundError({ message: "No user with this ID found.", logging: true });
  }
}

export async function getUserEvents(userId: number) {
  let events: Array<Event> = [];
  const [dbEvents] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM event WHERE user_id = ?',
    [userId]
  );
  dbEvents.forEach(dbEvent => {
    const event: Event = new Event(dbEvent.id, dbEvent.user_id, dbEvent.name, dbEvent.description, dbEvent.start_date, dbEvent.length, dbEvent.completed);
    events.push(event);
  });
  return events
}

export async function getUserQueries(userId: number): Promise<Array<Query>> {
  let queries: Array<Query> = [];
  const [dbQueries] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM query WHERE user_id = ?',
    [userId]
  );
  dbQueries.forEach(dbQuery => {
    const query: Query = new Query(
      dbQuery.id,
      dbQuery.user_id,
      dbQuery.date,
      dbQuery.prompt,
      dbQuery.response
    );
    queries.push(query);
  });
  return queries;
}

export async function getUserTasks(userId: number): Promise<Array<Task>> {
  let tasks: Array<Task> = [];
  const [dbTasks] = await pool.execute<RowDataPacket[]>(
    'SELECT t.* FROM task t JOIN event e ON t.event_id = e.id WHERE e.user_id = ?',
    [userId]
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

export async function getUserPayments(userId: number): Promise<Array<Payment>> {
  let payments: Array<Payment> = [];
  const [dbPayments] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM payment WHERE user_id = ?',
    [userId]
  );
  dbPayments.forEach(dbPayment => {
    const payment: Payment = new Payment(
      dbPayment.id,
      dbPayment.date,
      dbPayment.amount,
      dbPayment.subscription_id,
      dbPayment.user_id
    );
    payments.push(payment);
  });
  return payments;
}

export async function getUserSubscription(userId: number): Promise<Subscription> {
  // Retrieve the most recent payment
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM payment WHERE user_id = ? ORDER BY date DESC LIMIT 1',
    [userId]
  );
  if (rows.length > 0) {
    const dbPayment = rows[0];
    const paymentDate = new Date(dbPayment.date);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - paymentDate.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    // If the payment is within 30 days, return its subscription
    if (diffDays <= 30) {
      return await getSubscription(dbPayment.subscription_id);
    }
  }
  // Default to the Free subscription tier if no valid recent payment exists
  const [freeRows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM subscription WHERE name = ?',
    ['Free']
  );
  if (freeRows.length > 0) {
    const freeSub = freeRows[0];
    const subscription: Subscription = new Subscription(
      freeSub.id,
      freeSub.name,
      freeSub.price_usd,
      freeSub.query_limit
    );
    return subscription;
  } else {
    throw new NotFoundError({ message: "Free subscription tier not found.", logging: true });
  }
}

export async function logIn(email: string, password: string): Promise<User> {
  // Query the database for the user using the username
  const [dbUsers] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM user WHERE email = ?',
    [email]
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

  const user: User = new User(dbUser.id, dbUser.first_name, dbUser.last_name, dbUser.email, dbUser.password);
  return user;
}

export async function createUser(firstName: string, lastName: string, email: string, password: string): Promise<User> {
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO user (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
    [firstName, lastName, email, password]
  );
  const insertedId = result.insertId;
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM user WHERE id = ?',
    [insertedId]
  );
  const dbUser = rows[0];
  const user: User = new User(dbUser.id, dbUser.first_name, dbUser.last_name, dbUser.email, dbUser.password);
  return user;
}

export async function deleteUser(id: number): Promise<User> {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM user WHERE id = ?', [id]);
  if (rows.length > 0) {
    const dbUser = rows[0];
    await pool.execute('DELETE FROM user WHERE id = ?', [id]);
    const user: User = new User(dbUser.id, dbUser.first_name, dbUser.last_name, dbUser.email, dbUser.password);
    return user;
  } else {
    throw new NotFoundError({ message: "User not found.", logging: true });
  }
}

export async function updateUser(id: number, firstName: string, lastName: string, email: string, password: string): Promise<User> {
  const [result] = await pool.execute<ResultSetHeader>(
    'UPDATE user SET first_name = ?, last_name = ?, email = ?, password = ? WHERE id = ?',
    [firstName, lastName, email, password, id]
  );
  if (result.affectedRows > 0) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM user WHERE id = ?',
      [id]
    );
    const dbUser = rows[0];
    const user: User = new User(dbUser.id, dbUser.first_name, dbUser.last_name, dbUser.email, dbUser.password);
    return user;
  } else {
    throw new NotFoundError({ message: "User not found.", logging: true });
  }
}