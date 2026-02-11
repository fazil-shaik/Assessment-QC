import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../db/schema';
export declare class QCService {
    private db;
    constructor(db: BetterSQLite3Database<typeof schema>);
    submitQC(taskId: number, data: any): Promise<{
        success: boolean;
    }>;
}
