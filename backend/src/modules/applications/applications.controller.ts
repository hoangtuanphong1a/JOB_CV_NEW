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
import { ApplicationsService } from './applications.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApplicationStatus } from '../common/entities/application.entity';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Apply for a job' })
  @ApiResponse({
    status: 201,
    description: 'Application created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Job not available for applications',
  })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiResponse({ status: 409, description: 'Already applied for this job' })
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
    @Request() req,
  ) {
    return this.applicationsService.create(createApplicationDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get applications with filtering and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'jobId', required: false, type: String })
  @ApiQuery({ name: 'applicantId', required: false, type: String })
  @ApiQuery({ name: 'reviewedById', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Applications retrieved successfully',
  })
  async findAll(@Query() query: any) {
    return this.applicationsService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiOperation({ summary: 'Get application by ID' })
  @ApiResponse({
    status: 200,
    description: 'Application retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiOperation({ summary: 'Update application' })
  @ApiResponse({
    status: 200,
    description: 'Application updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not application owner',
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @Request() req,
  ) {
    return this.applicationsService.update(
      id,
      updateApplicationDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiOperation({ summary: 'Withdraw application' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Application withdrawn successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot withdraw accepted/rejected applications',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not application owner',
  })
  async remove(@Param('id') id: string, @Request() req) {
    return this.applicationsService.remove(id, req.user.id);
  }

  @Post(':id/status')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiOperation({ summary: 'Update application status (Employer only)' })
  @ApiResponse({
    status: 200,
    description: 'Application status updated successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not job employer' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: ApplicationStatus; notes?: string },
    @Request() req,
  ) {
    return this.applicationsService.updateStatus(
      id,
      body.status,
      req.user.id,
      body.notes,
    );
  }

  @Post(':id/interview')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiOperation({ summary: 'Schedule interview (Employer only)' })
  @ApiResponse({
    status: 200,
    description: 'Interview scheduled successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Can only schedule interviews for shortlisted applications',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not job employer' })
  async scheduleInterview(
    @Param('id') id: string,
    @Body() body: { interviewDate: string; notes: string },
    @Request() req,
  ) {
    return this.applicationsService.scheduleInterview(
      id,
      new Date(body.interviewDate),
      body.notes,
      req.user.id,
    );
  }

  @Get('job/:jobId')
  @ApiParam({ name: 'jobId', description: 'Job ID' })
  @ApiOperation({ summary: 'Get applications for a specific job' })
  @ApiResponse({
    status: 200,
    description: 'Job applications retrieved successfully',
  })
  async getJobApplications(@Param('jobId') jobId: string, @Request() req) {
    const userId = req.user?.id; // Optional for public access if needed
    return this.applicationsService.findByJob(jobId, userId);
  }

  @Get('user/my-applications')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user applications' })
  @ApiResponse({
    status: 200,
    description: 'User applications retrieved successfully',
  })
  async getMyApplications(@Request() req) {
    return this.applicationsService.findByApplicant(req.user.id);
  }

  @Get('user/my-stats')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get application statistics for current user' })
  @ApiResponse({
    status: 200,
    description: 'Application stats retrieved successfully',
  })
  async getMyStats(@Request() req) {
    return this.applicationsService.getApplicationStats(req.user.id);
  }

  @Post(':id/view')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiOperation({ summary: 'Increment view count (Employer only)' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'View count incremented',
  })
  async incrementViewCount(@Param('id') id: string, @Request() req) {
    return this.applicationsService.incrementViewCount(id, req.user.id);
  }
}
