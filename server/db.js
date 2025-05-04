const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function setup() {
  const db = await open({ filename: './database.db', driver: sqlite3.Database });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      display_name TEXT,
      bio TEXT,
      avatar TEXT
    );
    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT,
      url TEXT
    );
  `);
  return db;
}

module.exports = { db: setup() };
