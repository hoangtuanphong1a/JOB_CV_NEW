import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
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
} from '@nestjs/swagger';
import { JobseekerService } from './jobseeker.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CreateJobSeekerProfileDto } from './dto/create-job-seeker-profile.dto';
import { UpdateJobSeekerProfileDto } from './dto/update-job-seeker-profile.dto';

@ApiTags('Job Seeker')
@Controller('jobseeker')
export class JobseekerController {
  constructor(private readonly jobseekerService: JobseekerService) {}

  @Post('profile')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create job seeker profile' })
  @ApiResponse({
    status: 201,
    description: 'Profile created successfully',
  })
  async createProfile(
    @Body() createDto: CreateJobSeekerProfileDto,
    @Request() req,
  ) {
    return this.jobseekerService.createProfile(req.user.id, createDto);
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user job seeker profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
  })
  async getProfile(@Request() req) {
    return this.jobseekerService.findProfile(req.user.id);
  }

  @Put('profile')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update job seeker profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
  })
  async updateProfile(
    @Body() updateDto: UpdateJobSeekerProfileDto,
    @Request() req,
  ) {
    return this.jobseekerService.updateProfile(req.user.id, updateDto);
  }

  @Delete('profile')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete job seeker profile' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Profile deleted successfully',
  })
  async deleteProfile(@Request() req) {
    return this.jobseekerService.deleteProfile(req.user.id);
  }
}
