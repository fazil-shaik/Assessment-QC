"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qcResults = exports.tasks = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.tasks = (0, pg_core_1.pgTable)("tasks", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    workOrder: (0, pg_core_1.text)("work_order").notNull(),
    project: (0, pg_core_1.text)("project").notNull(),
    projectNo: (0, pg_core_1.text)("project_no"),
    signType: (0, pg_core_1.text)("sign_type"),
    department: (0, pg_core_1.text)("department"),
    status: (0, pg_core_1.text)("status").default("Pending"),
    assignedTo: (0, pg_core_1.text)("assigned_to"),
    quantity: (0, pg_core_1.integer)("quantity").default(1),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.qcResults = (0, pg_core_1.pgTable)("qc_results", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    taskId: (0, pg_core_1.integer)("task_id").references(() => exports.tasks.id),
    section: (0, pg_core_1.text)("section").notNull(),
    checkpoint: (0, pg_core_1.text)("checkpoint").notNull(),
    status: (0, pg_core_1.text)("status").default("Pending"),
    comment: (0, pg_core_1.text)("comment"),
    imagePath: (0, pg_core_1.text)("image_path"),
    submittedAt: (0, pg_core_1.timestamp)("submitted_at").defaultNow(),
});
//# sourceMappingURL=schema.js.map