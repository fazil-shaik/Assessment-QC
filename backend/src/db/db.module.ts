import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

export const DRIZZLE = 'DRIZZLE';

@Global()
@Module({
    providers: [
        {
            provide: DRIZZLE,
            useFactory: () => {
                const sqlite = new Database('sqlite.db');
                return drizzle(sqlite, { schema });
            },
        },
    ],
    exports: [DRIZZLE],
})
export class DbModule { }
