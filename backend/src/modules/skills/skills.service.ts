import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from '../common/entities/skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}

  async create(data: Partial<Skill>): Promise<Skill> {
    const skill = this.skillRepository.create(data);
    return this.skillRepository.save(skill);
  }

  async findAll(): Promise<Skill[]> {
    return this.skillRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Skill> {
    const skill = await this.skillRepository.findOne({
      where: { id },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    return skill;
  }

  async update(id: string, data: Partial<Skill>): Promise<Skill> {
    await this.findOne(id);
    await this.skillRepository.update(id, data);
    const updated = await this.skillRepository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException('Skill not found after update');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const skill = await this.findOne(id);
    await this.skillRepository.remove(skill);
  }

  async searchByName(name: string): Promise<Skill[]> {
    return this.skillRepository
      .createQueryBuilder('skill')
      .where('skill.name LIKE :name', { name: `%${name}%` })
      .orderBy('skill.name', 'ASC')
      .getMany();
  }

  async getPopularSkills(limit = 20): Promise<Skill[]> {
    // This would typically involve counting usage in job_skills table
    // For now, return all skills ordered by name
    return this.skillRepository.find({
      order: { name: 'ASC' },
      take: limit,
    });
  }
}
