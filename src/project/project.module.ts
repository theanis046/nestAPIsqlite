import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

import { ProjectEntity } from './entities/project.entity';
import { EmployeeService } from './employee.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectEntity]),
    HttpModule ],
    controllers: [ProjectController],
    providers: [ProjectService, EmployeeService],
})
export class ProjectModule {

}
