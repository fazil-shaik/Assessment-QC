import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
    id: serial("id").primaryKey(),
    workOrder: text("work_order").notNull(),
    project: text("project").notNull(),
    projectNo: text("project_no"),
    signType: text("sign_type"),
    department: text("department"),
    status: text("status").default("Pending"), // Pending, Assigned, In Progress, Completed
    assignedTo: text("assigned_to"),
    quantity: integer("quantity").default(1),
    createdAt: timestamp("created_at").defaultNow(),
});

export const qcResults = pgTable("qc_results", {
    id: serial("id").primaryKey(),
    taskId: integer("task_id").references(() => tasks.id),
    section: text("section").notNull(), // e.g. "Letter Moulding"
    checkpoint: text("checkpoint").notNull(), // e.g. "Depth of Material"
    status: text("status").default("Pending"), // Pass, Fail, NA
    comment: text("comment"),
    imagePath: text("image_path"),
    submittedAt: timestamp("submitted_at").defaultNow(),
});
