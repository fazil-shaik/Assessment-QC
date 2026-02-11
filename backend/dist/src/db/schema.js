"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qcResults = exports.tasks = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.tasks = (0, sqlite_core_1.sqliteTable)("tasks", {
    id: (0, sqlite_core_1.integer)("id").primaryKey({ autoIncrement: true }),
    workOrder: (0, sqlite_core_1.text)("work_order").notNull(),
    project: (0, sqlite_core_1.text)("project").notNull(),
    projectNo: (0, sqlite_core_1.text)("project_no"),
    signType: (0, sqlite_core_1.text)("sign_type"),
    department: (0, sqlite_core_1.text)("department"),
    status: (0, sqlite_core_1.text)("status").default("Pending"),
    assignedTo: (0, sqlite_core_1.text)("assigned_to"),
    quantity: (0, sqlite_core_1.integer)("quantity").default(1),
    createdAt: (0, sqlite_core_1.text)("created_at").default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
exports.qcResults = (0, sqlite_core_1.sqliteTable)("qc_results", {
    id: (0, sqlite_core_1.integer)("id").primaryKey({ autoIncrement: true }),
    taskId: (0, sqlite_core_1.integer)("task_id").references(() => exports.tasks.id),
    section: (0, sqlite_core_1.text)("section").notNull(),
    checkpoint: (0, sqlite_core_1.text)("checkpoint").notNull(),
    status: (0, sqlite_core_1.text)("status").default("Pending"),
    comment: (0, sqlite_core_1.text)("comment"),
    imagePath: (0, sqlite_core_1.text)("image_path"),
    submittedAt: (0, sqlite_core_1.text)("submitted_at").default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
//# sourceMappingURL=schema.js.map