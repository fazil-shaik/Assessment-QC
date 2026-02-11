import { Controller, Get, Param, ParseIntPipe, Post, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get()
    findAll() {
        return this.tasksService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.tasksService.findOne(id);
    }

    @Post(':id/assign')
    assign(@Param('id', ParseIntPipe) id: number, @Body() body: { assignee: string }) {
        return this.tasksService.assignTask(id, body.assignee);
    }

    @Post()
    create(@Body() body: any) {
        return this.tasksService.create({
            ...body,
            status: 'Pending',
            createdAt: new Date(),
            assignedTo: 'Unassigned',
            projectNo: `P-${Math.floor(Math.random() * 1000)}`
        });
    }
}
