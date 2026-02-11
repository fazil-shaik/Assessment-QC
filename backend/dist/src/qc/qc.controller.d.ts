import { QCService } from './qc.service';
export declare class QCController {
    private readonly qcService;
    constructor(qcService: QCService);
    submit(taskId: number, data: any): Promise<{
        success: boolean;
    }>;
}
