import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
export declare class TasksService {
    private db;
    constructor(db: PostgresJsDatabase<typeof schema>);
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
        createdAt: Date | null;
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
        createdAt: Date | null;
    }>;
    getQCResults(taskId: number): Promise<{
        id: number;
        taskId: number | null;
        section: string;
        checkpoint: string;
        status: string | null;
        comment: string | null;
        imagePath: string | null;
        submittedAt: Date | null;
    }[]>;
}
