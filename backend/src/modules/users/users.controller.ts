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
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleName } from '../common/entities/role.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - admin access required',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    // Check if current user is admin
    const isAdmin = await this.usersService.hasRole(
      req.user.id,
      RoleName.ADMIN,
    );
    if (!isAdmin) {
      throw new ForbiddenException('Only admin can create users');
    }

    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all users with filtering and pagination (Admin only)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - admin access required',
  })
  async findAll(@Query() query: any, @Request() req) {
    // Check if current user is admin
    const isAdmin = await this.usersService.hasRole(
      req.user.id,
      RoleName.ADMIN,
    );
    if (!isAdmin) {
      throw new ForbiddenException('Only admin can view all users');
    }

    return this.usersService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not authorized to view this user',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    // Check if current user is admin or viewing their own profile
    const isAdmin = await this.usersService.hasRole(
      req.user.id,
      RoleName.ADMIN,
    );
    if (!isAdmin && req.user.id !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }

    return this.usersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not authorized to update this user',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.usersService.update(id, updateUserDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - admin access required',
  })
  async remove(@Param('id') id: string, @Request() req) {
    // Check if current user is admin
    const isAdmin = await this.usersService.hasRole(
      req.user.id,
      RoleName.ADMIN,
    );
    if (!isAdmin) {
      throw new ForbiddenException('Only admin can delete users');
    }

    return this.usersService.remove(id, req.user.id);
  }

  @Post(':id/activate')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOperation({ summary: 'Activate user (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User activated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - admin access required',
  })
  async activate(@Param('id') id: string, @Request() req) {
    // Check if current user is admin
    const isAdmin = await this.usersService.hasRole(
      req.user.id,
      RoleName.ADMIN,
    );
    if (!isAdmin) {
      throw new ForbiddenException('Only admin can activate users');
    }

    return this.usersService.activateUser(id);
  }

  @Post(':id/deactivate')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOperation({ summary: 'Deactivate user (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User deactivated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - admin access required',
  })
  async deactivate(@Param('id') id: string, @Request() req) {
    // Check if current user is admin
    const isAdmin = await this.usersService.hasRole(
      req.user.id,
      RoleName.ADMIN,
    );
    if (!isAdmin) {
      throw new ForbiddenException('Only admin can deactivate users');
    }

    return this.usersService.deactivateUser(id);
  }

  @Post(':id/change-password')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOperation({ summary: 'Change user password' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not authorized to change this password',
  })
  async changePassword(
    @Param('id') id: string,
    @Body() body: { newPassword: string },
    @Request() req,
  ) {
    // Check if current user is admin or changing their own password
    const isAdmin = await this.usersService.hasRole(
      req.user.id,
      RoleName.ADMIN,
    );
    if (!isAdmin && req.user.id !== id) {
      throw new ForbiddenException('You can only change your own password');
    }

    await this.usersService.updatePassword(id, body.newPassword);
    return { message: 'Password changed successfully' };
  }

  @Get('stats/overview')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user statistics (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User stats retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - admin access required',
  })
  async getStats(@Request() req) {
    // Check if current user is admin
    const isAdmin = await this.usersService.hasRole(
      req.user.id,
      RoleName.ADMIN,
    );
    if (!isAdmin) {
      throw new ForbiddenException('Only admin can view user statistics');
    }

    return this.usersService.getUserStats();
  }

  @Get('profile/me')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  async getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Put('profile/me')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
  })
  async updateProfile(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.update(req.user.id, updateUserDto, req.user.id);
  }
}
