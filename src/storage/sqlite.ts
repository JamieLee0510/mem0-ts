import sqlite3 from "sqlite3";
import { v4 as uuidv4 } from "uuid";

export interface HistoryRecord {
    id: string;
    memoryId: string;
    preValue: string;
    newValue: string;
    event: string;
    timestamp: string; // Use string to represent ISO 8601 format
    isDeleted: number;
}

export class SQLiteManager {
    private connection: sqlite3.Database;

    constructor(dbPath: string = ":memory:") {
        this.connection = new sqlite3.Database(
            dbPath,
            sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
        );
        this._createHistoryTable();
    }

    private _createHistoryTable(): void {
        this.connection.run(
            `
        CREATE TABLE IF NOT EXISTS history (
          id TEXT PRIMARY KEY,
          memoryId TEXT,
          preValue TEXT,
          newValue TEXT,
          event TEXT,
          timestamp DATETIME,
          isDeleted INTEGER
        )
      `,
        );
    }

    public addHistory(
        memoryId: string,
        preValue: string,
        newValue: string,
        event: string,
        isDeleted: number = 0,
    ): void {
        const id = uuidv4();
        const timestamp = new Date().toISOString();
        this.connection.run(
            `
        INSERT INTO history (id, memoryId, preValue, newValue, event, timestamp, isDeleted)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
            [id, memoryId, preValue, newValue, event, timestamp, isDeleted],
        );
    }

    public getHistory(memoryId: string): Promise<HistoryRecord[]> {
        return new Promise((resolve, reject) => {
            this.connection.all(
                `
          SELECT id, memoryId, preValue, newValue, event, timestamp, isDeleted
          FROM history
          WHERE memoryId = ?
          ORDER BY timestamp ASC
        `,
                [memoryId],
                (err, rows: any[]) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(
                            rows.map((row) => ({
                                id: row.id,
                                memoryId: row.memoryId,
                                preValue: row.preValue,
                                newValue: row.newValue,
                                event: row.event,
                                timestamp: row.timestamp,
                                isDeleted: row.isDeleted,
                            })),
                        );
                    }
                },
            );
        });
    }

    public reset(): void {
        this.connection.run("DROP TABLE IF EXISTS history");
    }
}
