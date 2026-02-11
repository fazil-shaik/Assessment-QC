import { Body, Controller, Post, Param, ParseIntPipe } from '@nestjs/common';
import { QCService } from './qc.service';

@Controller('qc')
export class QCController {
    constructor(private readonly qcService: QCService) { }

    @Post(':taskId/submit')
    submit(@Param('taskId', ParseIntPipe) taskId: number, @Body() data: any) {
        return this.qcService.submitQC(taskId, data);
    }
}
