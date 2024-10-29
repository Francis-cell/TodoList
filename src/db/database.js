const { app } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const userDataPath = app.getPath("userData");
const dbPath = path.join(userDataPath, "sqliteDatabase.db");

console.log("Database path:", dbPath);

class Database {
    constructor() {
        this.db = new sqlite3.Database(dbPath);
    }

    open() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("PRAGMA foreign_keys = ON", (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log("Connected to the database.");
                        resolve();
                    }
                });
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("Database closed.");
                    resolve();
                }
            });
        });
    }

    query(param) {
        return new Promise((resolve, reject) => {
            this.db.all(param.sql, param.params || [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    insert(param) {
        return new Promise((resolve, reject) => {
            const keys = Object.keys(param.data);
            const values = Object.values(param.data);
            const placeholders = keys.map(() => "?").join(",");
            const sql = `INSERT INTO ${param.table} (${keys.join(",")}) VALUES (${placeholders})`;

            this.db.run(sql, values, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    update(param) {
        return new Promise((resolve, reject) => {
            const entries = Object.entries(param.data)
                .map(([key]) => `${key} = ?`)
                .join(",");
            const params = [...Object.values(param.data), param.condition];
            const sql = `UPDATE ${param.table} SET ${entries} WHERE ${param.condition}`;

            this.db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    delete(param) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM ${param.table} WHERE ${param.condition}`;

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

const db = new Database();

// 简单 sqlite 案例
const initSqlite = async () => {
    try {
        await db.open();
        await db.query({
            sql: `
                CREATE TABLE IF NOT EXISTS test (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    age INTEGER
                )
            `,
        });
        console.log("Database initialized.");
    } catch (err) {
        console.error("Error opening database:", err);
    }
};

module.exports = {
    db,
    initSqlite,
    sqQuery: db.query.bind(db),
    sqInsert: db.insert.bind(db),
    sqUpdate: db.update.bind(db),
    sqDelete: db.delete.bind(db),
};
