"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const schema = __importStar(require("./schema"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}
const client = (0, postgres_1.default)(connectionString);
const db = (0, postgres_js_1.drizzle)(client, { schema });
async function seed() {
    console.log("Seeding database...");
    try {
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
    }
    catch (error) {
        console.error("Error seeding database:", error);
    }
    finally {
        await client.end();
    }
}
seed().catch((err) => {
    console.error("Seeding failed", err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map