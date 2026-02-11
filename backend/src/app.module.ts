import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { TasksModule } from './tasks/tasks.module';
import { QCModule } from './qc/qc.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [DbModule, TasksModule, QCModule, UploadsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
