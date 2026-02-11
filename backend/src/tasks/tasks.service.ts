import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class TasksService {
    constructor(@Inject(DRIZZLE) private db: PostgresJsDatabase<typeof schema>) { }

    async findAll() {
        // .all() is for SQLite, .execute() is general, but with postgres-js adapter use standard query methods
        return this.db.select().from(schema.tasks);
    }

    async findOne(id: number) {
        const result = await this.db.select().from(schema.tasks).where(eq(schema.tasks.id, id));
        return result[0];
    }

    async getQCResults(taskId: number) {
        return this.db.select().from(schema.qcResults).where(eq(schema.qcResults.taskId, taskId));
    }
}
