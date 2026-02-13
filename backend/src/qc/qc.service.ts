import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class QCService {
    constructor(@Inject(DRIZZLE) private db: PostgresJsDatabase<typeof schema>) { }

    async submitQC(taskId: number, data: any) {
        const results: (typeof schema.qcResults.$inferInsert)[] = [];
        for (const [section, checkpoints] of Object.entries(data.sections)) {
            for (const cp of (checkpoints as any[])) {
                results.push({
                    taskId,
                    section,
                    checkpoint: cp.label,
                    status: cp.value || 'Pending',
                    comment: cp.comment,
                    imagePath: cp.image,
                });
            }
        }

        if (results.length > 0) {
            // Postgres: Use transaction for atomicity
            await this.db.transaction(async (tx) => {
                await tx.delete(schema.qcResults).where(eq(schema.qcResults.taskId, taskId));
                await tx.insert(schema.qcResults).values(results);

                await tx.update(schema.tasks)
                    .set({ status: 'Completed' })
                    .where(eq(schema.tasks.id, taskId));
            });
        }

        return { success: true };
    }
}
