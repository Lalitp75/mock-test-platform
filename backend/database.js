const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        db.serialize(() => {
            // Users Table - enhanced with class and full_name
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'student',
                class TEXT,
                branch TEXT,
                target_group TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // Tests Table - with scheduled_date and scheduled_time
            db.run(`CREATE TABLE IF NOT EXISTS tests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                duration INTEGER NOT NULL,
                eligibility_rules TEXT,
                result_display TEXT DEFAULT 'immediate',
                is_active BOOLEAN DEFAULT 1,
                scheduled_date TEXT,
                scheduled_time TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // Sections Table
            db.run(`CREATE TABLE IF NOT EXISTS sections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                test_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                duration_limit INTEGER,
                display_order INTEGER,
                FOREIGN KEY (test_id) REFERENCES tests (id) ON DELETE CASCADE
            )`);

            // Questions Table
            db.run(`CREATE TABLE IF NOT EXISTS questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                test_id INTEGER NOT NULL,
                section_id INTEGER,
                type TEXT NOT NULL,
                question_text TEXT NOT NULL,
                image_url TEXT,
                options TEXT,
                correct_answer TEXT,
                explanation TEXT,
                marks INTEGER DEFAULT 1,
                FOREIGN KEY (test_id) REFERENCES tests (id) ON DELETE CASCADE
            )`);

            // Test Attempts
            db.run(`CREATE TABLE IF NOT EXISTS test_attempts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                test_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                end_time DATETIME,
                status TEXT DEFAULT 'in_progress',
                time_remaining INTEGER,
                score INTEGER,
                FOREIGN KEY (test_id) REFERENCES tests (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`);

            // Answers Table
            db.run(`CREATE TABLE IF NOT EXISTS answers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                attempt_id INTEGER NOT NULL,
                question_id INTEGER NOT NULL,
                submitted_answer TEXT,
                is_correct BOOLEAN,
                marks_awarded INTEGER,
                FOREIGN KEY (attempt_id) REFERENCES test_attempts (id) ON DELETE CASCADE,
                FOREIGN KEY (question_id) REFERENCES questions (id)
            )`);
        });
    }
});

module.exports = db;
