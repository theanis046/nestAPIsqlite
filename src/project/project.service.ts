import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { UpdateResult, DeleteResult } from 'typeorm';
import { Role } from 'src/common/enums/role.enum';
import { EmployeeDto } from './entities/employee.dto';
import { EmployeeService } from './employee.service';

@Injectable()
export class ProjectService {

  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly employeeService: EmployeeService,
  ) { }

  async findAll(): Promise<ProjectEntity[]> {
    const projects = await this.projectRepository.find();
    console.info(projects);
    return projects;
  }

  /**
   * Creates a new Project
   * @param project expects a valid Owner Id from https://employees-api.vercel.app/api/
   * @throws BadRequestException
   */
  async create(project: ProjectEntity): Promise<ProjectEntity> {
    const manager = await this.employeeService.getEmployeeById(project.owner);

    if (manager && manager.role === Role.Manager) {
      const projectUpdated = await this.projectRepository.save(project);
      console.info(projectUpdated);
      return projectUpdated;
    } else {
      throw new BadRequestException('Please provide valid Owner/Manager Id');
    }
  }

  async update(id: number, project: ProjectEntity): Promise<UpdateResult> {
    return await this.projectRepository.update(id, project);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.projectRepository.delete(id);
  }

  /**
   * Update owner of the project.
   * @param projectId Project to be Updated
   * @param employeeId New Manager Id
   * EmployeeId must be of Manager. Throws BadRequestException if Not Manager
   * @returns ProjectEntity
   */
  async updateOwner(projectId: number, employeeId: string): Promise<ProjectEntity | undefined> {
      const employee = await this.employeeService.getEmployeeById(employeeId);
      let project;

      if (employee && this.isManager(employee)) {
        project = await this.projectRepository.findOne(projectId);
        if (project) {
          project.owner = employee.id;
          await this.projectRepository.update(project.id, project);
          console.info('Project Updated Successfully');
        }
      } else {
        console.error('Employee Got From API Is %j', employee);
        throw new BadRequestException('Only Admins can be Owner of the Project');
      }
      return project;
  }

  /**
   * pariticipantId should be a valid Id from https://employees-api.vercel.app/api/
   * Invalid Participant Id will Throw BadRequestException
   * Participant should be in same department as of Manager will throw BadRequestException otherwise
   * @param projectId Project to be updated
   * @param participantId Participant to be added
   * @returns UpdateResult.
   */
  async addParticipant(projectId: number, participantId: string): Promise<UpdateResult | null> {

    let employeeAndProject = [];
    let owner;
    try {
      employeeAndProject = await Promise.all([this.employeeService.getEmployeeById(participantId), this.projectRepository.findOne(projectId)]);
    } catch (ex) {
      console.error('Exception got from Employee and Project API Call');
      console.error(ex);
      throw new BadRequestException('Participant or Project are Invalid');
    }
    if (employeeAndProject) {
      if (employeeAndProject.length === 2) {
        const project = employeeAndProject[1];
        const participant = employeeAndProject[0];
        try {
          if (project) {
            owner = await this.employeeService.getEmployeeById(project.owner);
          } else {
            console.error(`Project is invalid ${projectId}`);
            throw new BadRequestException('Invalid Project');
          }
        } catch (error) {
          console.error(error);
          throw new BadRequestException(error.response.data);
        }

        if (owner && participant) {
        if (owner.department === participant.department) {
          if (project?.participants && project.participants.length > 0) {
            if (project.participants.indexOf(participant.id) < 0) {
              project.participants.push(participant.id);
              console.info('Adding participant to project list');
            } else {
              throw new BadRequestException('Participant Already exist in Project');
            }
          } else {
            console.info(`Adding new Participant ${participant.id} to project ${project.id}`);
            project.participants = [participant.id];
            console.info(project);
          }
          await this.update(projectId, project);
          console.info(`Project ${projectId} Updated`);
          } else {
            throw new BadRequestException('Participant must be in same department of Project Manager/Owner');
          }
        }
      }
    }
    return null;
  }

  /**
   * Utility Function to check if Employee is Manager.
   * @param employee
   */
  private isManager(employee: EmployeeDto): boolean {
    return employee.role === Role.Manager;
  }
}
