import pool from "../database.js";
import { Payment } from "../../models/payment.js";
import NotFoundError from "../../models/errors/not-found-error.js";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export async function getAllPayments() {
  let payments: Array<Payment> = [];
  const [dbPayments] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM payment'
  );
  dbPayments.forEach(dbPayment => {
    const payment: Payment = new Payment(
      dbPayment.id,
      new Date(dbPayment.date),
      dbPayment.amount,
      dbPayment.subscription_id,
      dbPayment.user_id
    );
    payments.push(payment);
  });
  return payments;
}

export async function getPayment(id: number): Promise<Payment> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM payment WHERE id = ?',
    [id]
  );
  if (rows.length > 0) {
    const dbPayment = rows[0];
    const payment: Payment = new Payment(
      dbPayment.id,
      new Date(dbPayment.date),
      dbPayment.amount,
      dbPayment.subscription_id,
      dbPayment.user_id
    );
    return payment;
  } else {
    throw new NotFoundError({ message: "No payment with this ID found.", logging: true });
  }
}

export async function createPayment(amount: number, subscriptionId: number, userId: number): Promise<Payment> {
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO payment (amount, subscription_id, user_id) VALUES (?, ?, ?)',
    [amount, subscriptionId, userId]
  );
  const insertedId = result.insertId;
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM payment WHERE id = ?',
    [insertedId]
  );
  const dbPayment = rows[0];
  const payment: Payment = new Payment(
    dbPayment.id,
    new Date(dbPayment.date),
    dbPayment.amount,
    dbPayment.subscription_id,
    dbPayment.user_id
  );
  return payment;
}

export async function deletePayment(id: number): Promise<Payment> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM payment WHERE id = ?',
    [id]
  );
  if (rows.length > 0) {
    const dbPayment = rows[0];
    await pool.execute('DELETE FROM payment WHERE id = ?', [id]);
    const payment: Payment = new Payment(
      dbPayment.id,
      new Date(dbPayment.date),
      dbPayment.amount,
      dbPayment.subscription_id,
      dbPayment.user_id
    );
    return payment;
  } else {
    throw new NotFoundError({ message: "Payment not found.", logging: true });
  }
}

export async function updatePayment(id: number, amount: number, subscriptionId: number, userId: number): Promise<Payment> {
  const [result] = await pool.execute<ResultSetHeader>(
    'UPDATE payment SET amount = ?, subscription_id = ?, user_id = ? WHERE id = ?',
    [amount, subscriptionId, userId, id]
  );
  if (result.affectedRows > 0) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM payment WHERE id = ?',
      [id]
    );
    const dbPayment = rows[0];
    const payment: Payment = new Payment(
      dbPayment.id,
      new Date(dbPayment.date),
      dbPayment.amount,
      dbPayment.subscription_id,
      dbPayment.user_id
    );
    return payment;
  } else {
    throw new NotFoundError({ message: "Payment not found.", logging: true });
  }
}
