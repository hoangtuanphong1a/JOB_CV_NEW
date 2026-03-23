import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
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
} from '@nestjs/swagger';
import { SavedJobsService } from './saved-jobs.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CreateSavedJobDto } from './dto/create-saved-job.dto';

@ApiTags('Saved Jobs')
@Controller('saved-jobs')
export class SavedJobsController {
  constructor(private readonly savedJobsService: SavedJobsService) {}

  @Post(':jobId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'jobId', description: 'Job ID to save' })
  @ApiOperation({ summary: 'Save a job' })
  @ApiResponse({
    status: 201,
    description: 'Job saved successfully',
  })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiResponse({ status: 409, description: 'Job is already saved' })
  async saveJob(@Param('jobId') jobId: string, @Request() req) {
    return this.savedJobsService.create({ jobId }, req.user.id);
  }

  @Delete(':jobId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'jobId', description: 'Job ID to unsave' })
  @ApiOperation({ summary: 'Unsave a job' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Job unsaved successfully',
  })
  @ApiResponse({ status: 404, description: 'Saved job not found' })
  async unsaveJob(@Param('jobId') jobId: string, @Request() req) {
    await this.savedJobsService.removeByJobId(jobId, req.user.id);
  }

  @Post('toggle/:jobId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'jobId', description: 'Job ID to toggle save' })
  @ApiOperation({ summary: 'Toggle save/unsave a job' })
  @ApiResponse({
    status: 200,
    description: 'Job save status toggled successfully',
  })
  async toggleSave(@Param('jobId') jobId: string, @Request() req) {
    return this.savedJobsService.toggleSave(jobId, req.user.id);
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user saved jobs' })
  @ApiResponse({
    status: 200,
    description: 'Saved jobs retrieved successfully',
  })
  async getMySavedJobs(@Request() req) {
    return this.savedJobsService.findAllByUser(req.user.id);
  }

  @Get('stats')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user saved jobs statistics' })
  @ApiResponse({
    status: 200,
    description: 'Saved jobs stats retrieved successfully',
  })
  async getMySavedJobsStats(@Request() req) {
    return this.savedJobsService.getSavedJobsStats(req.user.id);
  }

  @Get('check/:jobId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'jobId', description: 'Job ID to check' })
  @ApiOperation({ summary: 'Check if job is saved by current user' })
  @ApiResponse({
    status: 200,
    description: 'Job save status checked successfully',
  })
  async checkJobSaved(@Param('jobId') jobId: string, @Request() req) {
    const isSaved = await this.savedJobsService.isJobSaved(jobId, req.user.id);
    return { isSaved };
  }

  @Get('count/:jobId')
  @ApiParam({ name: 'jobId', description: 'Job ID to get save count' })
  @ApiOperation({ summary: 'Get save count for a job' })
  @ApiResponse({
    status: 200,
    description: 'Job save count retrieved successfully',
  })
  async getJobSaveCount(@Param('jobId') jobId: string) {
    const count = await this.savedJobsService.getJobSavedCount(jobId);
    return { count };
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Saved job ID' })
  @ApiOperation({ summary: 'Get saved job by ID' })
  @ApiResponse({
    status: 200,
    description: 'Saved job retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Saved job not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.savedJobsService.findOne(id, req.user.id);
  }

  @Delete('saved/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Saved job ID to delete' })
  @ApiOperation({ summary: 'Delete saved job by ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Saved job deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Saved job not found' })
  async remove(@Param('id') id: string, @Request() req) {
    await this.savedJobsService.remove(id, req.user.id);
  }
}
