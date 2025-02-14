import 'dotenv/config';
import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: process.env.DB_HOST,       // e.g., 'localhost'
  port: +(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;