import { db } from "../database";

// 简单 TodoCalendar 案例
const initTodoCalendar = async () => {
    try {
        await db.open();
        await db.query({
            sql: `
                CREATE TABLE IF NOT EXISTS todo_calendar (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 整型自增主键
                    event_name TEXT NOT NULL,               -- 代办任务名称
                    calendar TEXT DEFAULT ('Work'),        -- 代办任务类型（默认为 Work 类型）
                    color TEXT DEFAULT ('orange'),         -- 代办展示颜色（默认为 orange 类型）
                    date INTEGER,                          -- 整型字段（当月的第几天）
                    is_active NUMERIC DEFAULT 1,           -- 布尔值/数值
                    todo_date TEXT DEFAULT (date('now'))   -- 代办所处的日期
                )
            `,
        });
        console.log("Database initialized.");
    } catch (err) {
        console.error("Error opening database:", err);
    }
};

export default initTodoCalendar;