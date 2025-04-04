import pool from "../database.js";
import { Subscription } from "../../models/subscription.js";
import NotFoundError from "../../models/errors/not-found-error.js";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export async function getAllSubscriptions() {
  let subscriptions: Array<Subscription> = [];
  const [dbSubs] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM subscription'
  );
  dbSubs.forEach(dbSub => {
    const subscription: Subscription = new Subscription(
      dbSub.id,
      dbSub.name,
      dbSub.price_usd,
      dbSub.query_limit
    );
    subscriptions.push(subscription);
  });
  return subscriptions;
}

export async function getSubscription(id: number): Promise<Subscription> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM subscription WHERE id = ?',
    [id]
  );
  if (rows.length > 0) {
    const dbSub = rows[0];
    const subscription: Subscription = new Subscription(
      dbSub.id,
      dbSub.name,
      dbSub.price_usd,
      dbSub.query_limit
    );
    return subscription;
  } else {
    throw new NotFoundError({ message: "No subscription with this ID found.", logging: true });
  }
}

export async function createSubscription(name: string, priceUsd: number, queryLimit: number): Promise<Subscription> {
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO subscription (name, price_usd, query_limit) VALUES (?, ?, ?)',
    [name, priceUsd, queryLimit]
  );
  const insertedId = result.insertId;
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM subscription WHERE id = ?',
    [insertedId]
  );
  const dbSub = rows[0];
  const subscription: Subscription = new Subscription(
    dbSub.id,
    dbSub.name,
    dbSub.price_usd,
    dbSub.query_limit
  );
  return subscription;
}

export async function deleteSubscription(id: number): Promise<Subscription> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM subscription WHERE id = ?',
    [id]
  );
  if (rows.length > 0) {
    const dbSub = rows[0];
    await pool.execute('DELETE FROM subscription WHERE id = ?', [id]);
    const subscription: Subscription = new Subscription(
      dbSub.id,
      dbSub.name,
      dbSub.price_usd,
      dbSub.query_limit
    );
    return subscription;
  } else {
    throw new NotFoundError({ message: "Subscription not found.", logging: true });
  }
}

export async function updateSubscription(id: number, name: string, priceUsd: number, queryLimit: number): Promise<Subscription> {
  const [result] = await pool.execute<ResultSetHeader>(
    'UPDATE subscription SET name = ?, price_usd = ?, query_limit = ? WHERE id = ?',
    [name, priceUsd, queryLimit, id]
  );
  if (result.affectedRows > 0) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM subscription WHERE id = ?',
      [id]
    );
    const dbSub = rows[0];
    const subscription: Subscription = new Subscription(
      dbSub.id,
      dbSub.name,
      dbSub.price_usd,
      dbSub.query_limit
    );
    return subscription;
  } else {
    throw new NotFoundError({ message: "Subscription not found.", logging: true });
  }
}
