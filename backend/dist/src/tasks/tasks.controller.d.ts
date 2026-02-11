import { TasksService } from './tasks.service';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findAll(): Promise<{
        id: number;
        workOrder: string;
        project: string;
        projectNo: string | null;
        signType: string | null;
        department: string | null;
        status: string | null;
        assignedTo: string | null;
        quantity: number | null;
        createdAt: Date | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        workOrder: string;
        project: string;
        projectNo: string | null;
        signType: string | null;
        department: string | null;
        status: string | null;
        assignedTo: string | null;
        quantity: number | null;
        createdAt: Date | null;
    }>;
}
