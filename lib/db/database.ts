import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DB_DIR, 'videovault.db')

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
}

let _db: Database.Database | null = null

export function getDatabase(): Database.Database {
  if (_db) return _db

  _db = new Database(DB_PATH)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')

  runMigrations(_db)

  return _db
}

function runMigrations(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER NOT NULL UNIQUE,
      ran_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)

  const row = db.prepare('SELECT MAX(version) as max_version FROM migrations').get() as { max_version: number | null }
  const currentVersion = row?.max_version ?? 0

  if (currentVersion < 1) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tmdb_id INTEGER UNIQUE,
        title TEXT NOT NULL,
        year INTEGER,
        poster_path TEXT,
        backdrop_path TEXT,
        overview TEXT,
        runtime INTEGER,
        genre TEXT,
        director TEXT,
        rating TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS collection_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
        format TEXT NOT NULL CHECK(format IN ('DVD','Blu-ray','4K','VHS','Digital')),
        condition TEXT CHECK(condition IN ('Brand New','Like New','Very Good','Good','Acceptable')),
        notes TEXT,
        acquired_at TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS want_list (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
        priority INTEGER NOT NULL DEFAULT 2 CHECK(priority IN (1,2,3)),
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS series (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS series_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        series_id INTEGER NOT NULL REFERENCES series(id) ON DELETE CASCADE,
        movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
        sort_order INTEGER NOT NULL DEFAULT 0,
        UNIQUE(series_id, movie_id)
      );
    `)

    db.prepare('INSERT INTO migrations (version) VALUES (?)').run(1)
  }

  if (currentVersion < 2) {
    db.exec(`
      ALTER TABLE movies ADD COLUMN cast TEXT;
      ALTER TABLE movies ADD COLUMN tmdb_rating REAL;
      ALTER TABLE movies ADD COLUMN keywords TEXT;
    `)

    db.prepare('INSERT INTO migrations (version) VALUES (?)').run(2)
  }
  if (currentVersion < 3) {
    db.exec(`ALTER TABLE movies ADD COLUMN mpaa_rating TEXT;`)
    db.prepare('INSERT INTO migrations (version) VALUES (?)').run(3)
  }
}
