import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const tasks = sqliteTable("tasks", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    workOrder: text("work_order").notNull(),
    project: text("project").notNull(),
    projectNo: text("project_no"),
    signType: text("sign_type"),
    department: text("department"),
    status: text("status").default("Pending"), // Pending, Assigned, In Progress, Completed
    assignedTo: text("assigned_to"),
    quantity: integer("quantity").default(1),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const qcResults = sqliteTable("qc_results", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    taskId: integer("task_id").references(() => tasks.id),
    section: text("section").notNull(), // e.g. "Letter Moulding"
    checkpoint: text("checkpoint").notNull(), // e.g. "Depth of Material"
    status: text("status").default("Pending"), // Pass, Fail, NA
    comment: text("comment"),
    imagePath: text("image_path"),
    submittedAt: text("submitted_at").default(sql`CURRENT_TIMESTAMP`),
});
