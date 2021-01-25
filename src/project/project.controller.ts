import { Controller, Post, Body, Get, Put, Query, UseFilters } from '@nestjs/common';
import { ProjectEntity } from './entities/project.entity';
import { ProjectService } from './project.service';
import { HttpExceptionFilter } from 'src/common/http-exception.filter';

@Controller('project')
@UseFilters(new HttpExceptionFilter())
export class ProjectController {
    constructor(private projectService: ProjectService,
    ) {
    }

    @Get('/all')
    index(): Promise<ProjectEntity[]> {
        return this.projectService.findAll();
    }

    @Post('/create')
    async create(@Body() projectEntity: ProjectEntity): Promise<any> {
        return this.projectService.create(projectEntity);
    }

    @Put('/updateowner')
    async Updateowner(@Query() query: any) {
        const { projectId, ownerId } = query;
        return await this.projectService.updateOwner(projectId, ownerId);
    }

    @Put('/addParticipant')
    async AddParticipant(@Query() query: any) {
        const { projectId, participantId } = query;
        return await this.projectService.addParticipant(projectId, participantId);
    }
}
