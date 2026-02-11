import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
export declare class QCService {
    private db;
    constructor(db: PostgresJsDatabase<typeof schema>);
    submitQC(taskId: number, data: any): Promise<{
        success: boolean;
    }>;
}
