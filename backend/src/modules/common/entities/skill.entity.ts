import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('skills')
export class Skill extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;
}
