import { ProjectState } from '../../common/enums/projectstats.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Project')
export class ProjectEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    owner: string;

    @Column()
    state: ProjectState;

    @Column()
    progress: number;

    @Column('simple-array' , {nullable: true})
    participants?: string[];

    constructor() {
        this.id = 0;
        this.name = '';
        this.owner = '';
        this.state = ProjectState.Active;
        this.progress = 50;
    }
}
