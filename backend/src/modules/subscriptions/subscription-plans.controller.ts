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
import { SubscriptionPlansService } from './subscription-plans.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';

@ApiTags('Subscription Plans')
@Controller('subscription-plans')
export class SubscriptionPlansController {
  constructor(
    private readonly subscriptionPlansService: SubscriptionPlansService,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new subscription plan (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Subscription plan created successfully',
  })
  async create(
    @Body() createSubscriptionPlanDto: CreateSubscriptionPlanDto,
    @Request() req,
  ) {
    // Check if current user is admin
    // const isAdmin = await this.usersService.hasRole(req.user.id, 'admin');
    // if (!isAdmin) {
    //   throw new Error('Only admin can create subscription plans');
    // }

    return this.subscriptionPlansService.create(createSubscriptionPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscription plans' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'planType', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({
    status: 200,
    description: 'Subscription plans retrieved successfully',
  })
  async findAll(@Query() query: any) {
    return this.subscriptionPlansService.findAll(query);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active subscription plans' })
  @ApiResponse({
    status: 200,
    description: 'Active subscription plans retrieved successfully',
  })
  async findActivePlans() {
    return this.subscriptionPlansService.findActivePlans();
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular subscription plans' })
  @ApiResponse({
    status: 200,
    description: 'Popular subscription plans retrieved successfully',
  })
  async getPopularPlans() {
    return this.subscriptionPlansService.getPopularPlans();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Subscription plan ID' })
  @ApiOperation({ summary: 'Get subscription plan by ID' })
  @ApiResponse({
    status: 200,
    description: 'Subscription plan retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Subscription plan not found' })
  async findOne(@Param('id') id: string) {
    return this.subscriptionPlansService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Subscription plan ID' })
  @ApiOperation({ summary: 'Update subscription plan (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Subscription plan updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
    @Request() req,
  ) {
    return this.subscriptionPlansService.update(id, updateSubscriptionPlanDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Subscription plan ID' })
  @ApiOperation({ summary: 'Delete subscription plan (Admin only)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Subscription plan deleted successfully',
  })
  async remove(@Param('id') id: string, @Request() req) {
    return this.subscriptionPlansService.remove(id);
  }

  @Post(':id/activate')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Subscription plan ID' })
  @ApiOperation({ summary: 'Activate subscription plan (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Subscription plan activated successfully',
  })
  async activate(@Param('id') id: string, @Request() req) {
    return this.subscriptionPlansService.activatePlan(id);
  }

  @Post(':id/deactivate')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Subscription plan ID' })
  @ApiOperation({ summary: 'Deactivate subscription plan (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Subscription plan deactivated successfully',
  })
  async deactivate(@Param('id') id: string, @Request() req) {
    return this.subscriptionPlansService.deactivatePlan(id);
  }

  @Get('stats/overview')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get subscription plans statistics (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Subscription plans stats retrieved successfully',
  })
  async getStats(@Request() req) {
    return this.subscriptionPlansService.getPlanStats();
  }
}
