import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../common/entities/role.entity';
import { HRCompanyRelationshipService } from './hr-company-relationship.service';

@ApiTags('HR Company Relationships')
@Controller('hr-company-relationships')
@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleName.ADMIN, RoleName.EMPLOYER)
export class HRCompanyRelationshipController {
  constructor(
    private readonly hrCompanyRelationshipService: HRCompanyRelationshipService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Assign HR user to a company' })
  @ApiResponse({
    status: 201,
    description: 'HR assigned to company successfully',
  })
  async assignHRToCompany(
    @Body()
    body: {
      hrUserId: string;
      companyId: string;
      hrRole?: string;
      permissions?: object;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Request() req,
  ) {
    return this.hrCompanyRelationshipService.assignHRToCompany(
      body.hrUserId,
      body.companyId,
      body.hrRole,
      body.permissions,
    );
  }

  @Get('hr/:hrUserId')
  @ApiOperation({ summary: 'Get companies assigned to HR user' })
  @ApiResponse({ status: 200, description: 'Companies retrieved successfully' })
  async getCompaniesForHR(@Param('hrUserId') hrUserId: string) {
    return this.hrCompanyRelationshipService.getCompaniesForHR(hrUserId);
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Get HR users assigned to company' })
  @ApiResponse({ status: 200, description: 'HR users retrieved successfully' })
  async getHRForCompany(@Param('companyId') companyId: string) {
    return this.hrCompanyRelationshipService.getHRForCompany(companyId);
  }

  @Put(':hrUserId/:companyId')
  @ApiOperation({ summary: 'Update HR role and permissions for company' })
  @ApiResponse({ status: 200, description: 'HR role updated successfully' })
  async updateHRRole(
    @Param('hrUserId') hrUserId: string,
    @Param('companyId') companyId: string,
    @Body() body: { hrRole: string; permissions?: object },
  ) {
    return this.hrCompanyRelationshipService.updateHRRole(
      hrUserId,
      companyId,
      body.hrRole,
      body.permissions,
    );
  }

  @Put(':hrUserId/:companyId/status')
  @ApiOperation({ summary: 'Toggle HR active status for company' })
  @ApiResponse({ status: 200, description: 'HR status updated successfully' })
  async toggleHRStatus(
    @Param('hrUserId') hrUserId: string,
    @Param('companyId') companyId: string,
    @Body() body: { isActive: boolean },
  ) {
    return this.hrCompanyRelationshipService.toggleHRStatus(
      hrUserId,
      companyId,
      body.isActive,
    );
  }

  @Delete(':hrUserId/:companyId')
  @ApiOperation({ summary: 'Remove HR from company' })
  @ApiResponse({
    status: 200,
    description: 'HR removed from company successfully',
  })
  async removeHRFromCompany(
    @Param('hrUserId') hrUserId: string,
    @Param('companyId') companyId: string,
  ) {
    await this.hrCompanyRelationshipService.removeHRFromCompany(
      hrUserId,
      companyId,
    );
    return { message: 'HR removed from company successfully' };
  }

  @Get('check/:hrUserId/:companyId')
  @ApiOperation({ summary: 'Check if HR is assigned to company' })
  @ApiResponse({ status: 200, description: 'Check result returned' })
  async isHRForCompany(
    @Param('hrUserId') hrUserId: string,
    @Param('companyId') companyId: string,
  ) {
    const isHR = await this.hrCompanyRelationshipService.isHRForCompany(
      hrUserId,
      companyId,
    );
    return { isHR };
  }

  @Get('user/:userId/companies')
  @ApiOperation({ summary: 'Get companies where user is HR' })
  @ApiResponse({
    status: 200,
    description: 'User HR companies retrieved successfully',
  })
  async getUserHRCompanies(@Param('userId') userId: string) {
    return this.hrCompanyRelationshipService.getHRCompaniesForUser(userId);
  }
}
