import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class QCService {
    constructor(@Inject(DRIZZLE) private db: BetterSQLite3Database<typeof schema>) { }

    async submitQC(taskId: number, data: any) {
        // data.sections is map of section -> checkpoints
        const results = [];
        for (const [section, checkpoints] of Object.entries(data.sections)) {
            for (const cp of (checkpoints as any[])) {
                results.push({
                    taskId,
                    section,
                    checkpoint: cp.label,
                    status: cp.value || 'Pending',
                    comment: data.comment, // Global comment for now, or per check if extended
                });
            }
        }

        // Insert results
        if (results.length > 0) {
            // Delete existing for this task to overwrite?
            await this.db.delete(schema.qcResults).where(eq(schema.qcResults.taskId, taskId));
            await this.db.insert(schema.qcResults).values(results);

            // Update task status
            await this.db.update(schema.tasks)
                .set({ status: 'Completed' })
                .where(eq(schema.tasks.id, taskId));
        }

        return { success: true };
    }
}
