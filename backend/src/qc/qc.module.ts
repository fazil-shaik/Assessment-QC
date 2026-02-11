import { Module } from '@nestjs/common';
import { QCService } from './qc.service';
import { QCController } from './qc.controller';

@Module({
    controllers: [QCController],
    providers: [QCService],
})
export class QCModule { }
