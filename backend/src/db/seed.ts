import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function seed() {
    console.log("Seeding database...");

    try {
        // Clear existing data
        await db.delete(schema.qcResults);
        await db.delete(schema.tasks);

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
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await client.end();
    }
}

seed().catch((err) => {
    console.error("Seeding failed", err);
    process.exit(1);
});
