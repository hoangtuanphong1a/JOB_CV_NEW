import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { Skill } from '../common/entities/skill.entity';

@ApiTags('Skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiResponse({
    status: 201,
    description: 'Skill created successfully',
    type: Skill,
  })
  async create(@Body() data: Partial<Skill>): Promise<Skill> {
    return this.skillsService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all skills' })
  @ApiResponse({
    status: 200,
    description: 'Skills retrieved successfully',
    type: [Skill],
  })
  async findAll(): Promise<Skill[]> {
    return this.skillsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search skills by name' })
  @ApiQuery({ name: 'name', description: 'Skill name to search for' })
  @ApiResponse({
    status: 200,
    description: 'Skills found successfully',
    type: [Skill],
  })
  async search(@Query('name') name: string): Promise<Skill[]> {
    return this.skillsService.searchByName(name);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular skills' })
  @ApiQuery({
    name: 'limit',
    description: 'Number of skills to return',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Popular skills retrieved successfully',
    type: [Skill],
  })
  async getPopular(@Query('limit') limit?: string): Promise<Skill[]> {
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.skillsService.getPopularSkills(limitNum);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Skill ID' })
  @ApiOperation({ summary: 'Get skill by ID' })
  @ApiResponse({
    status: 200,
    description: 'Skill retrieved successfully',
    type: Skill,
  })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  async findOne(@Param('id') id: string): Promise<Skill> {
    return this.skillsService.findOne(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'Skill ID' })
  @ApiOperation({ summary: 'Update skill' })
  @ApiResponse({
    status: 200,
    description: 'Skill updated successfully',
    type: Skill,
  })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Skill>,
  ): Promise<Skill> {
    return this.skillsService.update(id, data);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Skill ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete skill' })
  @ApiResponse({
    status: 204,
    description: 'Skill deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.skillsService.remove(id);
  }
}
