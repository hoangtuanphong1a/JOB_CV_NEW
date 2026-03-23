import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { EmployerService } from './employer.service';
import { JwtGuard } from '../common/guards/jwt.guard';

@ApiTags('Employer Dashboard')
@Controller('employer')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Get('dashboard/stats')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get employer dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard stats retrieved successfully',
  })
  async getDashboardStats(@Request() req) {
    return this.employerService.getDashboardStats(req.user.id);
  }

  @Get('dashboard/jobs')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get employer active jobs' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Active jobs retrieved successfully',
  })
  async getActiveJobs(@Request() req, @Query('limit') limit?: number) {
    return this.employerService.getActiveJobs(req.user.id, limit);
  }

  @Get('dashboard/applicants')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get recent applicants for employer' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Recent applicants retrieved successfully',
  })
  async getRecentApplicants(@Request() req, @Query('limit') limit?: number) {
    return this.employerService.getRecentApplicants(req.user.id, limit);
  }
}
