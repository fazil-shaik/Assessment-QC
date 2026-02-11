import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../db/schema';
export declare class TasksService {
    private db;
    constructor(db: BetterSQLite3Database<typeof schema>);
    findAll(): Promise<{
        id: number;
        workOrder: string;
        project: string;
        projectNo: string | null;
        signType: string | null;
        department: string | null;
        status: string | null;
        assignedTo: string | null;
        quantity: number | null;
        createdAt: string | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        workOrder: string;
        project: string;
        projectNo: string | null;
        signType: string | null;
        department: string | null;
        status: string | null;
        assignedTo: string | null;
        quantity: number | null;
        createdAt: string | null;
    } | undefined>;
    getQCResults(taskId: number): Promise<{
        id: number;
        taskId: number | null;
        section: string;
        checkpoint: string;
        status: string | null;
        comment: string | null;
        imagePath: string | null;
        submittedAt: string | null;
    }[]>;
}
