import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JobCategoriesService } from './job-categories.service';
import { JobCategory } from '../common/entities/job-category.entity';

@ApiTags('Job Categories')
@Controller('job-categories')
export class JobCategoriesController {
  constructor(private readonly jobCategoriesService: JobCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new job category' })
  @ApiResponse({
    status: 201,
    description: 'Job category created successfully',
    type: JobCategory,
  })
  async create(@Body() data: Partial<JobCategory>): Promise<JobCategory> {
    return this.jobCategoriesService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all job categories' })
  @ApiResponse({
    status: 200,
    description: 'Job categories retrieved successfully',
    type: [JobCategory],
  })
  async findAll(): Promise<JobCategory[]> {
    return this.jobCategoriesService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Job Category ID' })
  @ApiOperation({ summary: 'Get job category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Job category retrieved successfully',
    type: JobCategory,
  })
  @ApiResponse({ status: 404, description: 'Job category not found' })
  async findOne(@Param('id') id: string): Promise<JobCategory> {
    return this.jobCategoriesService.findOne(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'Job Category ID' })
  @ApiOperation({ summary: 'Update job category' })
  @ApiResponse({
    status: 200,
    description: 'Job category updated successfully',
    type: JobCategory,
  })
  @ApiResponse({ status: 404, description: 'Job category not found' })
  async update(
    @Param('id') id: string,
    @Body() data: Partial<JobCategory>,
  ): Promise<JobCategory> {
    return this.jobCategoriesService.update(id, data);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Job Category ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete job category' })
  @ApiResponse({
    status: 204,
    description: 'Job category deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Job category not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.jobCategoriesService.remove(id);
  }
}
