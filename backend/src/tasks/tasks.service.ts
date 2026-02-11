import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import { DrizzleQL } from 'drizzle-orm/better-sqlite3'; // Typo? No, type is BetterSQLite3Database
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class TasksService {
    constructor(@Inject(DRIZZLE) private db: BetterSQLite3Database<typeof schema>) { }

    async findAll() {
        return this.db.select().from(schema.tasks).all();
    }

    async findOne(id: number) {
        const result = this.db.select().from(schema.tasks).where(eq(schema.tasks.id, id)).get();
        return result;
    }

    async getQCResults(taskId: number) {
        return this.db.select().from(schema.qcResults).where(eq(schema.qcResults.taskId, taskId)).all();
    }
}
