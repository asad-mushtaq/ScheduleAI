import pool from "../../database/database.js";


test('Mysql connection resolve', async () => {
    const connection = await pool.getConnection();
    expect(connection.connect()).resolves;
    pool.end();
});