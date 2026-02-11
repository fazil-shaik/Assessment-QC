import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema });

async function seed() {
    console.log("Seeding database...");

    await db.delete(schema.tasks);
    await db.delete(schema.qcResults);

    await db.insert(schema.tasks).values([
        {
            workOrder: "WO-BRIDIP-22847",
            project: "BRI UAE-J26481-07-25",
            projectNo: "BRI-UAE-QC-12210",
            department: "Polishing",
            signType: "JCD Rework",
            status: "Assigned",
            assignedTo: "Vergin BRI",
            quantity: 10,
        },
        {
            workOrder: "WO-BRIDIP-22844",
            project: "BRI UAE-J2641-07-25",
            projectNo: "BRI-UAE-QC-12218",
            department: "Sanding",
            signType: "Order Point Signage",
            status: "Assigned",
            assignedTo: "Arshad",
            quantity: 10,
        },
        {
            workOrder: "WO-BRIDIP-22844",
            project: "BRI UAE-J26475-07-25",
            projectNo: "BRI-UAE-QC-12218",
            department: "Fabrication",
            signType: "Replacement to damaged...",
            status: "Pending",
            assignedTo: "Not Assigned",
            quantity: 1,
        }
    ]);

    console.log("Seeding complete!");
}

seed().catch((err) => {
    console.error("Seeding failed", err);
    process.exit(1);
});
