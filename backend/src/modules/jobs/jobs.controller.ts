import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Permission, RoleName } from '../common/entities/role.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleName.EMPLOYER, RoleName.HR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new job posting' })
  @ApiResponse({
    status: 201,
    description: 'Job created successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async create(@Body() createJobDto: CreateJobDto, @Request() req) {
    return this.jobsService.create(createJobDto, req.user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all published jobs with filtering and pagination',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'jobType', required: false, type: String })
  @ApiQuery({ name: 'experienceLevel', required: false, type: String })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'country', required: false, type: String })
  @ApiQuery({ name: 'remoteWork', required: false, type: Boolean })
  @ApiQuery({ name: 'skills', required: false, type: [String] })
  @ApiQuery({ name: 'tags', required: false, type: [String] })
  @ApiQuery({ name: 'minSalary', required: false, type: Number })
  @ApiQuery({ name: 'maxSalary', required: false, type: Number })
  @ApiQuery({ name: 'companyId', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Jobs retrieved successfully',
  })
  async findAll(@Query() query: any, @Request() req) {
    const userId = req.user?.id; // Optional - for authenticated users
    return this.jobsService.findAll(query, userId);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiOperation({ summary: 'Get job by ID' })
  @ApiResponse({
    status: 200,
    description: 'Job retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id; // Optional - for authenticated users
    return this.jobsService.findOne(id, userId);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiOperation({ summary: 'Update job posting' })
  @ApiResponse({
    status: 200,
    description: 'Job updated successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not company owner' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Request() req,
  ) {
    return this.jobsService.update(id, updateJobDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiOperation({ summary: 'Delete job posting' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Job deleted successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not company owner' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.jobsService.remove(id, req.user.id);
  }

  @Post(':id/publish')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiOperation({ summary: 'Publish a draft job' })
  @ApiResponse({
    status: 200,
    description: 'Job published successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not company owner' })
  @ApiResponse({ status: 400, description: 'Job is not in draft status' })
  async publish(@Param('id') id: string, @Request() req) {
    return this.jobsService.publishJob(id, req.user.id);
  }

  @Post(':id/close')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiOperation({ summary: 'Close a published job' })
  @ApiResponse({
    status: 200,
    description: 'Job closed successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not company owner' })
  async close(@Param('id') id: string, @Request() req) {
    return this.jobsService.closeJob(id, req.user.id);
  }

  @Get('company/:companyId')
  @ApiParam({ name: 'companyId', description: 'Company ID' })
  @ApiOperation({ summary: 'Get all jobs for a company' })
  @ApiResponse({
    status: 200,
    description: 'Company jobs retrieved successfully',
  })
  async findByCompany(@Param('companyId') companyId: string) {
    return this.jobsService.findByCompany(companyId);
  }

  @Get('user/my-jobs')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: "Get jobs from user's companies" })
  @ApiResponse({
    status: 200,
    description: 'User company jobs retrieved successfully',
  })
  async getMyJobs(@Request() req) {
    return this.jobsService.getJobStats(req.user.id);
  }
}
