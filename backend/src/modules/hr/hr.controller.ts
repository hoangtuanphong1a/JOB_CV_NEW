import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../common/entities/role.entity';
import { HRService } from './hr.service';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ScheduleInterviewDto } from './dto/schedule-interview.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('hr')
@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleName.EMPLOYER, RoleName.HR)
export class HRController {
  constructor(private readonly hrService: HRService) {}

  @Get('companies')
  async getCompanies(@Request() req) {
    return this.hrService.getUserCompanies(req.user.id);
  }

  @Get('dashboard/stats')
  async getDashboardStats(@Request() req) {
    return this.hrService.getDashboardStats(req.user.id);
  }

  @Get('jobs')
  async getJobs(@Request() req, @Query() query: any) {
    return this.hrService.getJobs(req.user.id, query);
  }

  @Get('jobs/:id')
  async getJob(@Param('id') id: string, @Request() req) {
    return this.hrService.getJob(id, req.user.id);
  }

  @Put('jobs/:id/status')
  async updateJobStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req,
  ) {
    return this.hrService.updateJobStatus(id, status, req.user.id);
  }

  @Get('applications')
  async getApplications(@Request() req, @Query() query: any) {
    return this.hrService.getApplications(req.user.id, query);
  }

  @Get('applications/:id')
  async getApplication(@Param('id') id: string, @Request() req) {
    return this.hrService.getApplication(id, req.user.id);
  }

  @Put('applications/:id/status')
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateApplicationStatusDto,
    @Request() req,
  ) {
    return this.hrService.updateApplicationStatus(id, updateDto, req.user.id);
  }

  @Post('applications/:id/interview')
  async scheduleInterview(
    @Param('id') id: string,
    @Body() scheduleDto: ScheduleInterviewDto,
    @Request() req,
  ) {
    return this.hrService.scheduleInterview(id, scheduleDto, req.user.id);
  }

  @Post('applications/:id/message')
  async sendMessageToApplicant(
    @Param('id') id: string,
    @Body() messageDto: SendMessageDto,
    @Request() req,
  ) {
    return this.hrService.sendMessageToApplicant(id, messageDto, req.user.id);
  }

  @Get('team')
  async getTeamMembers(@Request() req) {
    return this.hrService.getTeamMembers(req.user.id);
  }

  @Get('reports/overview')
  async getReportsOverview(@Request() req, @Query() query: any) {
    return this.hrService.getReportsOverview(req.user.id, query);
  }

  @Get('reports/job-performance')
  async getJobPerformanceReports(@Request() req, @Query() query: any) {
    return this.hrService.getJobPerformanceReports(req.user.id, query);
  }

  @Get('reports/hiring-funnel')
  async getHiringFunnelReport(@Request() req, @Query() query: any) {
    return this.hrService.getHiringFunnelReport(req.user.id, query);
  }

  @Get('interviews/upcoming')
  async getUpcomingInterviews(@Request() req) {
    return this.hrService.getUpcomingInterviews(req.user.id);
  }

  @Get('interviews')
  async getAllInterviews(@Request() req, @Query() query: any) {
    return this.hrService.getAllInterviews(req.user.id, query);
  }
}
