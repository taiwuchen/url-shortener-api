import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});


export async function initializeDatabase(): Promise<void> {
    try {
        console.log('Initializing database schema...');
        
        // Create the users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
        `);

        // Create the urls table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS urls (
                id SERIAL PRIMARY KEY,
                short_code TEXT UNIQUE NOT NULL,
                original_url TEXT NOT NULL,
                user_id INTEGER REFERENCES users(id)
            );
        `);

        console.log('Database schema initialized successfully.');
    } catch (error) {
        console.error('Error initializing database schema:', error);
        process.exit(1);
    }
}

export default pool;