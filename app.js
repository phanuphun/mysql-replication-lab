import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2/promise';
import knex from 'knex';
import { faker } from '@faker-js/faker';

const app = express();
app.use(express.json());

const primaryKnex = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_WRITE_HOST,
        port: +process.env.DB_WRITE_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    }
});

const writePool = mysql.createPool({
    host: process.env.DB_WRITE_HOST,
    port: +process.env.DB_WRITE_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5
});

const readPool = mysql.createPool({
    host: process.env.DB_READ_HOST,
    port: +process.env.DB_READ_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5
});

async function whereAmI(pool) {
    const [r] = await pool.query(
        `SELECT 
            @@server_id AS server_id, 
            @@hostname AS host, 
            @@global.read_only AS ro, 
            @@global.super_read_only AS sro
        `
    );
    return r[0];
}

app.get('/health', async (_req, res) => {
    try {
        await writePool.query('SELECT 1');
        await readPool.query('SELECT 1');
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ ok: false, error: String(e) });
    }
});

app.post('/users', async (req, res) => {
    const { name } = req.body ?? {};
    if (!name) return res.status(400).json({ error: 'name is required' });
    try {
        const [r] = await writePool.execute('INSERT INTO users (name) VALUES (?)', [name]);
        res.json({ insertedId: r.insertId });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.get('/users/primary', async (_req, res) => {
    try {
        const [rows] = await writePool.query('SELECT * FROM users ORDER BY id DESC');
        const where = await whereAmI(writePool);
        res.json({ where, rows });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.get('/users/replica', async (_req, res) => {
    try {
        const [rows] = await readPool.query('SELECT * FROM users ORDER BY id DESC');
        const where = await whereAmI(readPool);
        res.json({ where, rows });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.get('/lag', async (_req, res) => {
    try {
        const [rows] = await readPool.query('SHOW REPLICA STATUS');
        const s = rows[0] || {};
        res.json({
            Replica_IO_Running: s.Replica_IO_Running,
            Replica_SQL_Running: s.Replica_SQL_Running,
            Seconds_Behind_Source: s.Seconds_Behind_Source,
            Retrieved_Gtid_Set: s.Retrieved_Gtid_Set,
            Executed_Gtid_Set: s.Executed_Gtid_Set
        });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.get('/user/random/:number', async (req, res) => {
    const { number } = req.params;
    if (!number || isNaN(number)) {
        return res.status(400).json({ error: 'Valid number is required' });
    }

    for (let i = 0; i < +number; i++) {
        const fakerName = faker.person.fullName();
        console.log(fakerName)
        await primaryKnex('users').insert({ name: fakerName })
        // insertedIds.push(r.id);
    }

    return res.json({
        ok: 1
    });

});


const port = +process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on http://localhost:${port}`));
