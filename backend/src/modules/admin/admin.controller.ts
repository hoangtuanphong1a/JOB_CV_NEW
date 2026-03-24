import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
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
  ApiBody,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../common/entities/role.entity';

@ApiTags('Admin Dashboard')
@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleName.ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ===== DASHBOARD OVERVIEW =====
  @Get('dashboard/overview')
  @ApiOperation({ summary: 'Get admin dashboard overview statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard overview statistics',
    schema: {
      type: 'object',
      properties: {
        users: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            active: { type: 'number' },
            newToday: { type: 'number' },
          },
        },
        jobs: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            active: { type: 'number' },
            newToday: { type: 'number' },
          },
        },
        companies: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            active: { type: 'number' },
            newToday: { type: 'number' },
          },
        },
        applications: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            pending: { type: 'number' },
            newToday: { type: 'number' },
          },
        },
        revenue: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            thisMonth: { type: 'number' },
            growth: { type: 'number' },
          },
        },
        system: {
          type: 'object',
          properties: {
            uptime: { type: 'number' },
            memoryUsage: { type: 'number' },
            diskUsage: { type: 'number' },
          },
        },
      },
    },
  })
  async getDashboardOverview() {
    return this.adminService.getDashboardOverview();
  }

  @Get('dashboard/charts')
  @ApiOperation({ summary: 'Get dashboard charts data' })
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['7d', '30d', '90d', '1y'],
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard charts data for analytics',
  })
  async getDashboardCharts(@Query('period') period: string = '30d') {
    return this.adminService.getDashboardCharts(period);
  }

  // ===== USER MANAGEMENT =====
  @Post('users')
  @ApiOperation({ summary: 'Create a new user (admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        role: { type: 'string', enum: Object.values(RoleName) },
      },
      required: ['email', 'password', 'role'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async createUser(
    @Body()
    userData: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      role: RoleName;
    },
  ) {
    return this.adminService.createUser(userData);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users with admin controls' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'role', required: false, enum: RoleName })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'inactive', 'banned'],
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'List of users with admin information',
  })
  async getAllUsers(@Query() query: any) {
    return this.adminService.getAllUsers(query);
  }

  @Get('users/:id/details')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOperation({ summary: 'Get detailed user information for admin' })
  @ApiResponse({ status: 200, description: 'Detailed user information' })
  async getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(id);
  }

  @Put('users/:id/status')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOperation({ summary: 'Update user status (activate/deactivate/ban)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['active', 'inactive', 'banned'] },
        reason: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  async updateUserStatus(
    @Param('id') id: string,
    @Body() body: { status: string; reason?: string },
  ) {
    return this.adminService.updateUserStatus(id, body.status, body.reason);
  }

  @Put('users/:id/role')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOperation({ summary: 'Update user role' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: { type: 'string', enum: Object.values(RoleName) },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  async updateUserRole(
    @Param('id') id: string,
    @Body() body: { role: RoleName },
  ) {
    return this.adminService.updateUserRole(id, body.role);
  }

  @Delete('users/:id')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOperation({ summary: 'Delete user (admin only)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  async deleteUser(@Param('id') id: string) {
    await this.adminService.deleteUser(id);
  }

  // ===== JOB MANAGEMENT =====
  @Get('jobs')
  @ApiOperation({ summary: 'Get all jobs for admin management' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['draft', 'published', 'closed', 'expired'],
  })
  @ApiQuery({ name: 'company', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of jobs with admin controls' })
  async getAllJobs(@Query() query: any) {
    return this.adminService.getAllJobs(query);
  }

  @Put('jobs/:id/status')
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiOperation({ summary: 'Update job status' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['draft', 'published', 'closed', 'expired'],
        },
        reason: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Job status updated successfully' })
  async updateJobStatus(
    @Param('id') id: string,
    @Body() body: { status: string; reason?: string },
  ) {
    return this.adminService.updateJobStatus(id, body.status, body.reason);
  }

  @Delete('jobs/:id')
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiOperation({ summary: 'Delete job (admin only)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Job deleted successfully' })
  async deleteJob(@Param('id') id: string) {
    await this.adminService.deleteJob(id);
  }

  // ===== COMPANY MANAGEMENT =====
  @Get('companies')
  @ApiOperation({ summary: 'Get all companies for admin management' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'inactive', 'suspended'],
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'List of companies with admin controls',
  })
  async getAllCompanies(@Query() query: any) {
    return this.adminService.getAllCompanies(query);
  }

  @Put('companies/:id/status')
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiOperation({ summary: 'Update company status' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['active', 'inactive', 'suspended'] },
        reason: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Company status updated successfully',
  })
  async updateCompanyStatus(
    @Param('id') id: string,
    @Body() body: { status: string; reason?: string },
  ) {
    return this.adminService.updateCompanyStatus(id, body.status, body.reason);
  }

  @Put('companies/:id/verify')
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiOperation({ summary: 'Verify or unverify a company' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isVerified: { type: 'boolean' },
        adminNotes: { type: 'string' },
      },
      required: ['isVerified'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Company verification status updated successfully',
  })
  async verifyCompany(
    @Param('id') id: string,
    @Body() body: { isVerified: boolean; adminNotes?: string },
  ) {
    return this.adminService.verifyCompany(
      id,
      body.isVerified,
      body.adminNotes,
    );
  }

  @Get('companies/pending-verifications')
  @ApiOperation({ summary: 'Get companies pending verification' })
  @ApiResponse({
    status: 200,
    description: 'List of companies awaiting verification',
  })
  async getPendingCompanyVerifications() {
    return this.adminService.getPendingCompanyVerifications();
  }

  @Delete('companies/:id')
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiOperation({ summary: 'Delete company (admin only)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Company deleted successfully' })
  async deleteCompany(@Param('id') id: string) {
    await this.adminService.deleteCompany(id);
  }

  // ===== APPLICATION MANAGEMENT =====
  @Get('applications')
  @ApiOperation({ summary: 'Get all applications for admin review' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: [
      'pending',
      'reviewing',
      'shortlisted',
      'interviewed',
      'offered',
      'hired',
      'rejected',
    ],
  })
  @ApiQuery({ name: 'jobId', required: false, type: String })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'List of applications with admin controls',
  })
  async getAllApplications(@Query() query: any) {
    return this.adminService.getAllApplications(query);
  }

  @Put('applications/:id/status')
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiOperation({ summary: 'Update application status (admin override)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: [
            'pending',
            'reviewing',
            'shortlisted',
            'interviewed',
            'offered',
            'hired',
            'rejected',
          ],
        },
        notes: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Application status updated successfully',
  })
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body() body: { status: string; notes?: string },
  ) {
    return this.adminService.updateApplicationStatus(
      id,
      body.status,
      body.notes,
    );
  }

  @Get('system/logs')
  @ApiOperation({ summary: 'Get system logs' })
  @ApiQuery({
    name: 'level',
    required: false,
    enum: ['error', 'warn', 'info', 'debug'],
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 100 })
  @ApiResponse({
    status: 200,
    description: 'System logs retrieved successfully',
  })
  async getSystemLogs(@Query() query: { level?: string; limit?: number }) {
    return this.adminService.getSystemLogs(query);
  }

  // ===== ANALYTICS & REPORTS =====
  @Get('reports/user-activity')
  @ApiOperation({ summary: 'Get user activity report' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'User activity report data' })
  async getUserActivityReport(
    @Query() query: { startDate?: string; endDate?: string },
  ) {
    return this.adminService.getUserActivityReport(query);
  }

  @Get('reports/job-market')
  @ApiOperation({ summary: 'Get job market analysis report' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Job market analysis data' })
  async getJobMarketReport(
    @Query() query: { startDate?: string; endDate?: string },
  ) {
    return this.adminService.getJobMarketReport(query);
  }

  @Get('reports/revenue')
  @ApiOperation({ summary: 'Get revenue report' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({
    name: 'groupBy',
    required: false,
    enum: ['day', 'week', 'month'],
  })
  @ApiResponse({ status: 200, description: 'Revenue report data' })
  async getRevenueReport(
    @Query() query: { startDate?: string; endDate?: string; groupBy?: string },
  ) {
    return this.adminService.getRevenueReport(query);
  }

  // ===== CONTENT MANAGEMENT =====
  @Get('content/stats')
  @ApiOperation({ summary: 'Get content management statistics' })
  @ApiResponse({
    status: 200,
    description: 'Content management statistics',
    schema: {
      type: 'object',
      properties: {
        totalSkills: { type: 'number' },
        totalCategories: { type: 'number' },
        skillsThisMonth: { type: 'number' },
        categoriesThisMonth: { type: 'number' },
      },
    },
  })
  async getContentStats() {
    return this.adminService.getContentStats();
  }

  @Get('content/skills')
  @ApiOperation({ summary: 'Get all skills for content management' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'List of skills with usage statistics',
  })
  async getAllSkills(@Query() query: any) {
    return this.adminService.getAllSkills(query);
  }

  @Post('content/skills')
  @ApiOperation({ summary: 'Create new skill' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Skill created successfully' })
  async createSkill(
    @Body() body: { name: string; description?: string; category?: string },
  ) {
    return this.adminService.createSkill(body);
  }

  @Put('content/skills/:id')
  @ApiParam({ name: 'id', description: 'Skill ID' })
  @ApiOperation({ summary: 'Update skill' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Skill updated successfully' })
  async updateSkill(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; category?: string },
  ) {
    return this.adminService.updateSkill(id, body);
  }

  @Delete('content/skills/:id')
  @ApiParam({ name: 'id', description: 'Skill ID' })
  @ApiOperation({ summary: 'Delete skill' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Skill deleted successfully' })
  async deleteSkill(@Param('id') id: string) {
    await this.adminService.deleteSkill(id);
  }

  @Get('content/job-categories')
  @ApiOperation({ summary: 'Get all job categories for content management' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'List of job categories with statistics',
  })
  async getAllJobCategories(@Query() query: any) {
    return this.adminService.getAllJobCategories(query);
  }

  @Post('content/job-categories')
  @ApiOperation({ summary: 'Create new job category' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Job category created successfully',
  })
  async createJobCategory(
    @Body() body: { name: string; description?: string },
  ) {
    return this.adminService.createJobCategory(body);
  }

  @Put('content/job-categories/:id')
  @ApiParam({ name: 'id', description: 'Job category ID' })
  @ApiOperation({ summary: 'Update job category' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Job category updated successfully',
  })
  async updateJobCategory(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string },
  ) {
    return this.adminService.updateJobCategory(id, body);
  }

  @Delete('content/job-categories/:id')
  @ApiParam({ name: 'id', description: 'Job category ID' })
  @ApiOperation({ summary: 'Delete job category' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Job category deleted successfully',
  })
  async deleteJobCategory(@Param('id') id: string) {
    await this.adminService.deleteJobCategory(id);
  }

  // ===== CANDIDATE MANAGEMENT =====
  @Get('candidates')
  @ApiOperation({ summary: 'Get all candidates with profile status' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'profileStatus', required: false, enum: ['incomplete', 'pending', 'approved', 'rejected'] })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive', 'banned'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'List of candidates with profile information',
  })
  async getAllCandidates(@Query() query: any) {
    return this.adminService.getAllCandidates(query);
  }

  @Get('candidates/:id/profile')
  @ApiParam({ name: 'id', description: 'Candidate User ID' })
  @ApiOperation({ summary: 'Get detailed candidate profile for review' })
  @ApiResponse({ status: 200, description: 'Detailed candidate profile information' })
  async getCandidateProfile(@Param('id') id: string) {
    return this.adminService.getCandidateProfile(id);
  }

  @Put('candidates/:id/approve-profile')
  @ApiParam({ name: 'id', description: 'Candidate User ID' })
  @ApiOperation({ summary: 'Approve candidate profile' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        notes: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Candidate profile approved successfully' })
  async approveCandidateProfile(
    @Param('id') id: string,
    @Body() body: { notes?: string },
  ) {
    return this.adminService.approveCandidateProfile(id, body.notes);
  }

  @Put('candidates/:id/reject-profile')
  @ApiParam({ name: 'id', description: 'Candidate User ID' })
  @ApiOperation({ summary: 'Reject candidate profile' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: { type: 'string' },
      },
      required: ['reason'],
    },
  })
  @ApiResponse({ status: 200, description: 'Candidate profile rejected successfully' })
  async rejectCandidateProfile(
    @Param('id') id: string,
    @Body() body: { reason: string },
  ) {
    return this.adminService.rejectCandidateProfile(id, body.reason);
  }

  @Put('candidates/:id/lock-account')
  @ApiParam({ name: 'id', description: 'Candidate User ID' })
  @ApiOperation({ summary: 'Lock candidate account' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: { type: 'string' },
        duration: { type: 'number', description: 'Lock duration in days (0 for permanent)' },
      },
      required: ['reason'],
    },
  })
  @ApiResponse({ status: 200, description: 'Candidate account locked successfully' })
  async lockCandidateAccount(
    @Param('id') id: string,
    @Body() body: { reason: string; duration?: number },
  ) {
    return this.adminService.lockCandidateAccount(id, body.reason, body.duration);
  }

  @Put('candidates/:id/unlock-account')
  @ApiParam({ name: 'id', description: 'Candidate User ID' })
  @ApiOperation({ summary: 'Unlock candidate account' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Candidate account unlocked successfully' })
  async unlockCandidateAccount(
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ) {
    return this.adminService.unlockCandidateAccount(id, body.reason);
  }

  @Get('candidates/:id/activity-history')
  @ApiParam({ name: 'id', description: 'Candidate User ID' })
  @ApiOperation({ summary: 'Get candidate activity history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Candidate activity history' })
  async getCandidateActivityHistory(
    @Param('id') id: string,
    @Query() query: any,
  ) {
    return this.adminService.getCandidateActivityHistory(id, query);
  }

  // ===== EMPLOYER MANAGEMENT =====
  @Get('employers')
  @ApiOperation({ summary: 'Get all employers with company status' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'companyStatus', required: false, enum: ['pending', 'active', 'suspended', 'rejected'] })
  @ApiQuery({ name: 'verificationStatus', required: false, enum: ['pending', 'verified', 'unverified'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'List of employers with company information',
  })
  async getAllEmployers(@Query() query: any) {
    return this.adminService.getAllEmployers(query);
  }

  @Get('employers/:id/company')
  @ApiParam({ name: 'id', description: 'Employer User ID' })
  @ApiOperation({ summary: 'Get detailed employer company information' })
  @ApiResponse({ status: 200, description: 'Detailed employer company information' })
  async getEmployerCompany(@Param('id') id: string) {
    return this.adminService.getEmployerCompany(id);
  }

  @Put('employers/:id/approve-company')
  @ApiParam({ name: 'id', description: 'Employer User ID' })
  @ApiOperation({ summary: 'Approve employer company' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        notes: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Employer company approved successfully' })
  async approveEmployerCompany(
    @Param('id') id: string,
    @Body() body: { notes?: string },
  ) {
    return this.adminService.approveEmployerCompany(id, body.notes);
  }

  @Put('employers/:id/reject-company')
  @ApiParam({ name: 'id', description: 'Employer User ID' })
  @ApiOperation({ summary: 'Reject employer company' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: { type: 'string' },
      },
      required: ['reason'],
    },
  })
  @ApiResponse({ status: 200, description: 'Employer company rejected successfully' })
  async rejectEmployerCompany(
    @Param('id') id: string,
    @Body() body: { reason: string },
  ) {
    return this.adminService.rejectEmployerCompany(id, body.reason);
  }

  @Put('employers/:id/suspend-company')
  @ApiParam({ name: 'id', description: 'Employer User ID' })
  @ApiOperation({ summary: 'Suspend employer company' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: { type: 'string' },
        duration: { type: 'number', description: 'Suspension duration in days (0 for indefinite)' },
      },
      required: ['reason'],
    },
  })
  @ApiResponse({ status: 200, description: 'Employer company suspended successfully' })
  async suspendEmployerCompany(
    @Param('id') id: string,
    @Body() body: { reason: string; duration?: number },
  ) {
    return this.adminService.suspendEmployerCompany(id, body.reason, body.duration);
  }

  @Get('employers/:id/activity-history')
  @ApiParam({ name: 'id', description: 'Employer User ID' })
  @ApiOperation({ summary: 'Get employer activity history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Employer activity history' })
  async getEmployerActivityHistory(
    @Param('id') id: string,
    @Query() query: any,
  ) {
    return this.adminService.getEmployerActivityHistory(id, query);
  }

  @Get('employers/:id/jobs')
  @ApiParam({ name: 'id', description: 'Employer User ID' })
  @ApiOperation({ summary: 'Get employer job postings' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['draft', 'published', 'closed', 'expired'] })
  @ApiResponse({ status: 200, description: 'Employer job postings' })
  async getEmployerJobs(
    @Param('id') id: string,
    @Query() query: any,
  ) {
    return this.adminService.getEmployerJobs(id, query);
  }

  @Put('employers/:id/jobs/:jobId/violation')
  @ApiParam({ name: 'id', description: 'Employer User ID' })
  @ApiParam({ name: 'jobId', description: 'Job ID' })
  @ApiOperation({ summary: 'Report job posting violation' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        violationType: { type: 'string', enum: ['spam', 'inappropriate', 'misleading', 'duplicate', 'other'] },
        description: { type: 'string' },
        action: { type: 'string', enum: ['warning', 'remove', 'suspend'] },
      },
      required: ['violationType', 'description', 'action'],
    },
  })
  @ApiResponse({ status: 200, description: 'Job violation reported successfully' })
  async reportJobViolation(
    @Param('id') id: string,
    @Param('jobId') jobId: string,
    @Body() body: { violationType: string; description: string; action: string },
  ) {
    return this.adminService.reportJobViolation(id, jobId, body);
  }

  // ===== SERVICE PACKAGE MANAGEMENT =====
  @Get('packages')
  @ApiOperation({ summary: 'Get all service packages' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive'] })
  @ApiResponse({
    status: 200,
    description: 'List of service packages',
  })
  async getAllPackages(@Query() query: any) {
    return this.adminService.getAllPackages(query);
  }

  @Post('packages')
  @ApiOperation({ summary: 'Create new service package' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        duration: { type: 'number', description: 'Duration in days' },
        features: { type: 'array', items: { type: 'string' } },
        maxJobs: { type: 'number' },
        maxApplications: { type: 'number' },
        isFeatured: { type: 'boolean' },
      },
      required: ['name', 'price', 'duration'],
    },
  })
  @ApiResponse({ status: 201, description: 'Service package created successfully' })
  async createPackage(
    @Body() body: {
      name: string;
      description?: string;
      price: number;
      duration: number;
      features?: string[];
      maxJobs?: number;
      maxApplications?: number;
      isFeatured?: boolean;
    },
  ) {
    return this.adminService.createPackage(body);
  }

  @Put('packages/:id')
  @ApiParam({ name: 'id', description: 'Package ID' })
  @ApiOperation({ summary: 'Update service package' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        duration: { type: 'number' },
        features: { type: 'array', items: { type: 'string' } },
        maxJobs: { type: 'number' },
        maxApplications: { type: 'number' },
        isFeatured: { type: 'boolean' },
        status: { type: 'string', enum: ['active', 'inactive'] },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Service package updated successfully' })
  async updatePackage(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.adminService.updatePackage(id, body);
  }

  @Delete('packages/:id')
  @ApiParam({ name: 'id', description: 'Package ID' })
  @ApiOperation({ summary: 'Delete service package' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Service package deleted successfully' })
  async deletePackage(@Param('id') id: string) {
    await this.adminService.deletePackage(id);
  }

  @Get('packages/:id/subscribers')
  @ApiParam({ name: 'id', description: 'Package ID' })
  @ApiOperation({ summary: 'Get package subscribers' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Package subscribers' })
  async getPackageSubscribers(
    @Param('id') id: string,
    @Query() query: any,
  ) {
    return this.adminService.getPackageSubscribers(id, query);
  }

  // ===== VIOLATION REPORTS =====
  @Get('violations')
  @ApiOperation({ summary: 'Get all violation reports' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: ['job', 'user', 'company', 'comment'] })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'reviewed', 'resolved', 'dismissed'] })
  @ApiResponse({
    status: 200,
    description: 'List of violation reports',
  })
  async getAllViolations(@Query() query: any) {
    return this.adminService.getAllViolations(query);
  }

  @Get('violations/:id')
  @ApiParam({ name: 'id', description: 'Violation ID' })
  @ApiOperation({ summary: 'Get violation details' })
  @ApiResponse({ status: 200, description: 'Violation details' })
  async getViolationDetails(@Param('id') id: string) {
    return this.adminService.getViolationDetails(id);
  }

  @Put('violations/:id/resolve')
  @ApiParam({ name: 'id', description: 'Violation ID' })
  @ApiOperation({ summary: 'Resolve violation report' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['warning', 'suspend', 'ban', 'dismiss'] },
        notes: { type: 'string' },
      },
      required: ['action'],
    },
  })
  @ApiResponse({ status: 200, description: 'Violation resolved successfully' })
  async resolveViolation(
    @Param('id') id: string,
    @Body() body: { action: string; notes?: string },
  ) {
    return this.adminService.resolveViolation(id, body.action, body.notes);
  }

  // ===== USER ROLE MANAGEMENT =====
  @Get('roles')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'List of all roles',
  })
  async getAllRoles() {
    return this.adminService.getAllRoles();
  }

  @Post('roles')
  @ApiOperation({ summary: 'Create new role' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        permissions: { type: 'array', items: { type: 'string' } },
      },
      required: ['name'],
    },
  })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  async createRole(
    @Body() body: {
      name: string;
      description?: string;
      permissions?: string[];
    },
  ) {
    return this.adminService.createRole(body);
  }

  @Put('roles/:id')
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiOperation({ summary: 'Update role' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        permissions: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  async updateRole(
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      description?: string;
      permissions?: string[];
    },
  ) {
    return this.adminService.updateRole(id, body);
  }

  @Delete('roles/:id')
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiOperation({ summary: 'Delete role' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Role deleted successfully' })
  async deleteRole(@Param('id') id: string) {
    await this.adminService.deleteRole(id);
  }

  @Get('roles/:id/users')
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiOperation({ summary: 'Get users with specific role' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Users with role' })
  async getUsersWithRole(
    @Param('id') id: string,
    @Query() query: any,
  ) {
    return this.adminService.getUsersWithRole(id, query);
  }

  @Put('users/:id/assign-role')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOperation({ summary: 'Assign role to user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roleId: { type: 'string' },
      },
      required: ['roleId'],
    },
  })
  @ApiResponse({ status: 200, description: 'Role assigned successfully' })
  async assignRoleToUser(
    @Param('id') id: string,
    @Body() body: { roleId: string },
  ) {
    return this.adminService.assignRoleToUser(id, body.roleId);
  }

  @Put('users/:id/remove-role')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOperation({ summary: 'Remove role from user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roleId: { type: 'string' },
      },
      required: ['roleId'],
    },
  })
  @ApiResponse({ status: 200, description: 'Role removed successfully' })
  async removeRoleFromUser(
    @Param('id') id: string,
    @Body() body: { roleId: string },
  ) {
    return this.adminService.removeRoleFromUser(id, body.roleId);
  }

  // ===== SYSTEM ACTIVITY MONITORING =====
  @Get('system/activities')
  @ApiOperation({ summary: 'Get system activities' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: ['user', 'job', 'company', 'application', 'system'] })
  @ApiQuery({ name: 'action', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'System activities',
  })
  async getSystemActivities(@Query() query: any) {
    return this.adminService.getSystemActivities(query);
  }

  @Get('system/activities/users/:userId')
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiOperation({ summary: 'Get specific user activities' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'User activities' })
  async getUserActivities(
    @Param('userId') userId: string,
    @Query() query: any,
  ) {
    return this.adminService.getUserActivities(userId, query);
  }

  @Get('system/statistics')
  @ApiOperation({ summary: 'Get system statistics' })
  @ApiQuery({ name: 'period', required: false, enum: ['24h', '7d', '30d', '90d'] })
  @ApiResponse({
    status: 200,
    description: 'System statistics',
  })
  async getSystemStatistics(@Query('period') period: string = '30d') {
    return this.adminService.getSystemStatistics(period);
  }

  // ===== BLOG COMMENT MODERATION =====
  @Get('blog/comments/pending')
  @ApiOperation({ summary: 'Get pending blog comments for moderation' })
  @ApiResponse({
    status: 200,
    description: 'List of pending comments requiring approval',
  })
  async getPendingBlogComments() {
    return this.adminService.getPendingBlogComments();
  }

  @Put('blog/comments/:id/approve')
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiOperation({ summary: 'Approve a blog comment' })
  @ApiResponse({
    status: 200,
    description: 'Comment approved successfully',
  })
  async approveBlogComment(@Param('id') id: string) {
    return this.adminService.approveBlogComment(id);
  }

  @Delete('blog/comments/:id/reject')
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiOperation({ summary: 'Reject a blog comment' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Comment rejected successfully',
  })
  async rejectBlogComment(@Param('id') id: string) {
    await this.adminService.rejectBlogComment(id);
  }

  @Post('blog/comments/bulk-approve')
  @ApiOperation({ summary: 'Bulk approve multiple blog comments' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        commentIds: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['commentIds'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Bulk approval results',
  })
  async bulkApproveBlogComments(@Body() body: { commentIds: string[] }) {
    return this.adminService.bulkApproveBlogComments(body.commentIds);
  }

  @Post('blog/comments/bulk-reject')
  @ApiOperation({ summary: 'Bulk reject multiple blog comments' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        commentIds: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['commentIds'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Bulk rejection results',
  })
  async bulkRejectBlogComments(@Body() body: { commentIds: string[] }) {
    return this.adminService.bulkRejectBlogComments(body.commentIds);
  }

  @Get('blog/comments/approved')
  @ApiOperation({ summary: 'Get approved blog comments' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'blogId', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'List of approved comments',
  })
  async getApprovedBlogComments(@Query() query: any) {
    return this.adminService.getApprovedBlogComments(query);
  }

  // ===== 2. JOB MANAGEMENT - DUYỆT TIN TUYỂN DỤNG =====
  @Get('jobs/pending')
  @ApiOperation({ summary: 'Get jobs pending for review' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of jobs pending for review',
  })
  async getPendingJobs(@Query() query: any) {
    return this.adminService.getPendingJobs(query);
  }

  @Post('jobs/:id/approve')
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiOperation({ summary: 'Approve a job posting' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        notes: { type: 'string' },
        isVip: { type: 'boolean' },
        isHot: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Job approved successfully',
  })
  async approveJob(
    @Param('id') id: string,
    @Body() body: { notes?: string; isVip?: boolean; isHot?: boolean },
  ) {
    return this.adminService.approveJob(id, body);
  }

  @Post('jobs/:id/reject')
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiOperation({ summary: 'Reject a job posting' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: { type: 'string' },
        reasonCode: { type: 'string', enum: ['inappropriate', 'spam', 'duplicate', 'misleading', 'other'] },
      },
      required: ['reason'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Job rejected successfully',
  })
  async rejectJob(
    @Param('id') id: string,
    @Body() body: { reason: string; reasonCode?: string },
  ) {
    return this.adminService.rejectJob(id, body.reason, body.reasonCode);
  }

  @Put('jobs/:id/flags')
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiOperation({ summary: 'Update job flags (VIP, HOT, Featured)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isVip: { type: 'boolean' },
        isHot: { type: 'boolean' },
        isFeatured: { type: 'boolean' },
        isUrgent: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Job flags updated successfully',
  })
  async updateJobFlags(
    @Param('id') id: string,
    @Body() body: { isVip?: boolean; isHot?: boolean; isFeatured?: boolean; isUrgent?: boolean },
  ) {
    return this.adminService.updateJobFlags(id, body);
  }

  @Get('jobs/statistics/by-category')
  @ApiOperation({ summary: 'Get job statistics by category' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Job statistics by category',
  })
  async getJobStatisticsByCategory(
    @Query() query: { startDate?: string; endDate?: string },
  ) {
    return this.adminService.getJobStatisticsByCategory(query);
  }

  @Get('jobs/statistics/by-status')
  @ApiOperation({ summary: 'Get job statistics by status' })
  @ApiResponse({
    status: 200,
    description: 'Job statistics by status',
  })
  async getJobStatisticsByStatus() {
    return this.adminService.getJobStatisticsByStatus();
  }

  // ===== 2.2 QUẢN LÝ NGÀNH NGHỀ =====
  @Get('job-categories/statistics')
  @ApiOperation({ summary: 'Get job category statistics with trends' })
  @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d', '1y'] })
  @ApiResponse({
    status: 200,
    description: 'Job category statistics with trends',
  })
  async getJobCategoryStatistics(@Query('period') period: string = '30d') {
    return this.adminService.getJobCategoryStatistics(period);
  }

  @Put('job-categories/:id/salary-range')
  @ApiParam({ name: 'id', description: 'Job Category ID' })
  @ApiOperation({ summary: 'Update average salary range for category' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        minSalary: { type: 'number' },
        maxSalary: { type: 'number' },
        currency: { type: 'string' },
      },
      required: ['minSalary', 'maxSalary'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Salary range updated successfully',
  })
  async updateCategorySalaryRange(
    @Param('id') id: string,
    @Body() body: { minSalary: number; maxSalary: number; currency?: string },
  ) {
    return this.adminService.updateCategorySalaryRange(id, body);
  }

  @Get('job-categories/trends')
  @ApiOperation({ summary: 'Get hiring trends by category' })
  @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d', '1y'] })
  @ApiResponse({
    status: 200,
    description: 'Hiring trends by category',
  })
  async getHiringTrends(@Query('period') period: string = '30d') {
    return this.adminService.getHiringTrends(period);
  }

  // ===== 2.3 QUẢN LÝ BÁO CÁO VI PHẠM =====
  @Get('reports/job-violations')
  @ApiOperation({ summary: 'Get job violation reports' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'reviewed', 'resolved', 'dismissed'] })
  @ApiQuery({ name: 'type', required: false, enum: ['spam', 'inappropriate', 'misleading', 'fake', 'other'] })
  @ApiResponse({
    status: 200,
    description: 'List of job violation reports',
  })
  async getJobViolationReports(@Query() query: any) {
    return this.adminService.getJobViolationReports(query);
  }

  @Get('reports/candidate-violations')
  @ApiOperation({ summary: 'Get candidate violation reports' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'reviewed', 'resolved', 'dismissed'] })
  @ApiResponse({
    status: 200,
    description: 'List of candidate violation reports',
  })
  async getCandidateViolationReports(@Query() query: any) {
    return this.adminService.getCandidateViolationReports(query);
  }

  @Put('reports/:id/resolve')
  @ApiParam({ name: 'id', description: 'Report ID' })
  @ApiOperation({ summary: 'Resolve a violation report' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['warning', 'suspend_content', 'suspend_account', 'dismiss'] },
        notes: { type: 'string' },
        notifyReporter: { type: 'boolean' },
        notifyReported: { type: 'boolean' },
      },
      required: ['action'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Report resolved successfully',
  })
  async resolveViolationReport(
    @Param('id') id: string,
    @Body() body: { action: string; notes?: string; notifyReporter?: boolean; notifyReported?: boolean },
  ) {
    return this.adminService.resolveViolationReport(id, body);
  }

  @Get('reports/disputes')
  @ApiOperation({ summary: 'Get dispute cases between employers and candidates' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['open', 'investigating', 'resolved', 'closed'] })
  @ApiResponse({
    status: 200,
    description: 'List of dispute cases',
  })
  async getDisputeCases(@Query() query: any) {
    return this.adminService.getDisputeCases(query);
  }

  // ===== 3. CONTENT MANAGEMENT - QUẢN LÝ BLOG =====
  @Get('blogs')
  @ApiOperation({ summary: 'Get all blog posts for admin' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['draft', 'published', 'archived'] })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'List of blog posts',
  })
  async getAllBlogs(@Query() query: any) {
    return this.adminService.getAllBlogs(query);
  }

  @Post('blogs')
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        excerpt: { type: 'string' },
        category: { type: 'string', enum: ['career_guide', 'market_news', 'interview_tips', 'cv_tips', 'company_culture'] },
        tags: { type: 'array', items: { type: 'string' } },
        featuredImage: { type: 'string' },
        status: { type: 'string', enum: ['draft', 'published'] },
        isFeatured: { type: 'boolean' },
      },
      required: ['title', 'content', 'category'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Blog post created successfully',
  })
  async createBlog(
    @Body() body: {
      title: string;
      content: string;
      excerpt?: string;
      category: string;
      tags?: string[];
      featuredImage?: string;
      status?: string;
      isFeatured?: boolean;
    },
  ) {
    return this.adminService.createBlog(body);
  }

  @Put('blogs/:id')
  @ApiParam({ name: 'id', description: 'Blog ID' })
  @ApiOperation({ summary: 'Update a blog post' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        excerpt: { type: 'string' },
        category: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        featuredImage: { type: 'string' },
        status: { type: 'string', enum: ['draft', 'published', 'archived'] },
        isFeatured: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Blog post updated successfully',
  })
  async updateBlog(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.adminService.updateBlog(id, body);
  }

  @Delete('blogs/:id')
  @ApiParam({ name: 'id', description: 'Blog ID' })
  @ApiOperation({ summary: 'Delete a blog post' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Blog post deleted successfully',
  })
  async deleteBlog(@Param('id') id: string) {
    await this.adminService.deleteBlog(id);
  }

  @Get('blogs/statistics')
  @ApiOperation({ summary: 'Get blog statistics' })
  @ApiResponse({
    status: 200,
    description: 'Blog statistics',
  })
  async getBlogStatistics() {
    return this.adminService.getBlogStatistics();
  }

  // ===== 3.2 QUẢN LÝ QUẢNG CÁO =====
  @Get('advertisements')
  @ApiOperation({ summary: 'Get all advertisements' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive', 'expired'] })
  @ApiQuery({ name: 'position', required: false, enum: ['homepage_banner', 'sidebar', 'job_listing', 'search_results'] })
  @ApiResponse({
    status: 200,
    description: 'List of advertisements',
  })
  async getAllAdvertisements(@Query() query: any) {
    return this.adminService.getAllAdvertisements(query);
  }

  @Post('advertisements')
  @ApiOperation({ summary: 'Create a new advertisement' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        imageUrl: { type: 'string' },
        targetUrl: { type: 'string' },
        position: { type: 'string', enum: ['homepage_banner', 'sidebar', 'job_listing', 'search_results'] },
        startDate: { type: 'string', format: 'date' },
        endDate: { type: 'string', format: 'date' },
        budget: { type: 'number' },
        advertiserName: { type: 'string' },
        advertiserEmail: { type: 'string' },
      },
      required: ['title', 'imageUrl', 'targetUrl', 'position', 'startDate', 'endDate'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Advertisement created successfully',
  })
  async createAdvertisement(
    @Body() body: {
      title: string;
      imageUrl: string;
      targetUrl: string;
      position: string;
      startDate: string;
      endDate: string;
      budget?: number;
      advertiserName?: string;
      advertiserEmail?: string;
    },
  ) {
    return this.adminService.createAdvertisement(body);
  }

  @Put('advertisements/:id')
  @ApiParam({ name: 'id', description: 'Advertisement ID' })
  @ApiOperation({ summary: 'Update an advertisement' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        imageUrl: { type: 'string' },
        targetUrl: { type: 'string' },
        position: { type: 'string' },
        startDate: { type: 'string' },
        endDate: { type: 'string' },
        budget: { type: 'number' },
        status: { type: 'string', enum: ['active', 'inactive'] },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Advertisement updated successfully',
  })
  async updateAdvertisement(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.adminService.updateAdvertisement(id, body);
  }

  @Delete('advertisements/:id')
  @ApiParam({ name: 'id', description: 'Advertisement ID' })
  @ApiOperation({ summary: 'Delete an advertisement' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Advertisement deleted successfully',
  })
  async deleteAdvertisement(@Param('id') id: string) {
    await this.adminService.deleteAdvertisement(id);
  }

  @Get('advertisements/:id/statistics')
  @ApiParam({ name: 'id', description: 'Advertisement ID' })
  @ApiOperation({ summary: 'Get advertisement performance statistics' })
  @ApiResponse({
    status: 200,
    description: 'Advertisement statistics',
  })
  async getAdvertisementStatistics(@Param('id') id: string) {
    return this.adminService.getAdvertisementStatistics(id);
  }

  @Get('advertisements/statistics/overview')
  @ApiOperation({ summary: 'Get advertisements overview statistics' })
  @ApiResponse({
    status: 200,
    description: 'Advertisements overview statistics',
  })
  async getAdvertisementsOverview() {
    return this.adminService.getAdvertisementsOverview();
  }

  // ===== 4. STATISTICS & REPORTS =====
  // 4.1 THỐNG KÊ NGƯỜI DÙNG
  @Get('statistics/users/overview')
  @ApiOperation({ summary: 'Get user statistics overview' })
  @ApiQuery({ name: 'period', required: false, enum: ['24h', '7d', '30d', '90d'] })
  @ApiResponse({
    status: 200,
    description: 'User statistics overview',
  })
  async getUserStatisticsOverview(@Query('period') period: string = '30d') {
    return this.adminService.getUserStatisticsOverview(period);
  }

  @Get('statistics/users/registrations')
  @ApiOperation({ summary: 'Get user registration statistics' })
  @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d', '1y'] })
  @ApiQuery({ name: 'groupBy', required: false, enum: ['day', 'week', 'month'] })
  @ApiResponse({
    status: 200,
    description: 'User registration statistics',
  })
  async getUserRegistrationStats(
    @Query('period') period: string = '30d',
    @Query('groupBy') groupBy: string = 'day',
  ) {
    return this.adminService.getUserRegistrationStats(period, groupBy);
  }

  @Get('statistics/users/conversion')
  @ApiOperation({ summary: 'Get user conversion rate statistics' })
  @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d'] })
  @ApiResponse({
    status: 200,
    description: 'User conversion statistics',
  })
  async getUserConversionStats(@Query('period') period: string = '30d') {
    return this.adminService.getUserConversionStats(period);
  }

  @Get('statistics/users/activity')
  @ApiOperation({ summary: 'Get user activity statistics' })
  @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d'] })
  @ApiResponse({
    status: 200,
    description: 'User activity statistics',
  })
  async getUserActivityStats(@Query('period') period: string = '30d') {
    return this.adminService.getUserActivityStats(period);
  }

  // 4.2 THỐNG KÊ VIỆC LÀM
  @Get('statistics/jobs/overview')
  @ApiOperation({ summary: 'Get job statistics overview' })
  @ApiQuery({ name: 'period', required: false, enum: ['24h', '7d', '30d', '90d'] })
  @ApiResponse({
    status: 200,
    description: 'Job statistics overview',
  })
  async getJobStatisticsOverview(@Query('period') period: string = '30d') {
    return this.adminService.getJobStatisticsOverview(period);
  }

  @Get('statistics/jobs/applications')
  @ApiOperation({ summary: 'Get job application rate statistics' })
  @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d'] })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Job application statistics',
  })
  async getJobApplicationStats(
    @Query('period') period: string = '30d',
    @Query('categoryId') categoryId?: string,
  ) {
    return this.adminService.getJobApplicationStats(period, categoryId);
  }

  @Get('statistics/jobs/hot-categories')
  @ApiOperation({ summary: 'Get hottest job categories' })
  @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d'] })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Hottest job categories',
  })
  async getHotJobCategories(
    @Query('period') period: string = '30d',
    @Query('limit') limit: number = 10,
  ) {
    return this.adminService.getHotJobCategories(period, limit);
  }

  @Get('statistics/jobs/salary-trends')
  @ApiOperation({ summary: 'Get salary trend statistics' })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'period', required: false, enum: ['30d', '90d', '1y'] })
  @ApiResponse({
    status: 200,
    description: 'Salary trend statistics',
  })
  async getSalaryTrends(
    @Query('categoryId') categoryId?: string,
    @Query('period') period: string = '90d',
  ) {
    return this.adminService.getSalaryTrends(categoryId, period);
  }

  // 4.3 BÁO CÁO DOANH THU
  @Get('reports/revenue/overview')
  @ApiOperation({ summary: 'Get revenue overview' })
  @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d', '1y'] })
  @ApiResponse({
    status: 200,
    description: 'Revenue overview',
  })
  async getRevenueOverview(@Query('period') period: string = '30d') {
    return this.adminService.getRevenueOverview(period);
  }

  @Get('reports/revenue/by-package')
  @ApiOperation({ summary: 'Get revenue by package type' })
  @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d', '1y'] })
  @ApiResponse({
    status: 200,
    description: 'Revenue by package',
  })
  async getRevenueByPackage(@Query('period') period: string = '30d') {
    return this.adminService.getRevenueByPackage(period);
  }

  @Get('reports/revenue/payment-methods')
  @ApiOperation({ summary: 'Get payment method statistics' })
  @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d'] })
  @ApiResponse({
    status: 200,
    description: 'Payment method statistics',
  })
  async getPaymentMethodStats(@Query('period') period: string = '30d') {
    return this.adminService.getPaymentMethodStats(period);
  }

  @Get('reports/revenue/transactions')
  @ApiOperation({ summary: 'Get recent transactions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'completed', 'failed', 'refunded'] })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Recent transactions',
  })
  async getRecentTransactions(@Query() query: any) {
    return this.adminService.getRecentTransactions(query);
  }

  @Get('reports/revenue/financial')
  @ApiOperation({ summary: 'Get financial report' })
  @ApiQuery({ name: 'period', required: false, enum: ['monthly', 'quarterly', 'yearly'] })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Financial report',
  })
  async getFinancialReport(
    @Query('period') reportPeriod: string = 'monthly',
    @Query('year') year?: number,
  ) {
    return this.adminService.getFinancialReport(reportPeriod, year);
  }
}
