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
import { JwtGuard } from '../common/guards/jwt.guard';
import { CompanyUsersService } from './company-users.service';
import { CreateCompanyUserDto } from './dto/create-company-user.dto';
import { UpdateCompanyUserDto } from './dto/update-company-user.dto';

@ApiTags('Company Users - Quản lý người dùng công ty')
@Controller('company-users')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
export class CompanyUsersController {
  constructor(private readonly companyUsersService: CompanyUsersService) {}

  @Post('invite')
  @ApiOperation({ summary: 'Mời thành viên vào công ty' })
  @ApiResponse({
    status: 201,
    description: 'Gửi lời mời thành công',
  })
  @ApiResponse({ status: 403, description: 'Không có quyền mời' })
  async inviteUser(@Body() createDto: CreateCompanyUserDto, @Request() req) {
    return this.companyUsersService.inviteUser(createDto, req.user.id);
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Lấy danh sách thành viên công ty' })
  @ApiParam({ name: 'companyId', description: 'ID công ty' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách thành viên thành công',
  })
  async findAllByCompany(
    @Param('companyId') companyId: string,
    @Query() query: any,
    @Request() req,
  ) {
    return this.companyUsersService.findAllByCompany(companyId, req.user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin thành viên' })
  @ApiParam({ name: 'id', description: 'ID thành viên' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin thành viên thành công',
  })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.companyUsersService.findOne(id, req.user.id);
  }

  @Put(':id/role')
  @ApiOperation({ summary: 'Cập nhật vai trò thành viên' })
  @ApiParam({ name: 'id', description: 'ID thành viên' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật vai trò thành công',
  })
  async updateRole(
    @Param('id') id: string,
    @Body() updateDto: UpdateCompanyUserDto,
    @Request() req,
  ) {
    return this.companyUsersService.updateRole(id, updateDto, req.user.id);
  }

  @Put(':id/permissions')
  @ApiOperation({ summary: 'Cập nhật quyền truy cập' })
  @ApiParam({ name: 'id', description: 'ID thành viên' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật quyền thành công',
  })
  async updatePermissions(
    @Param('id') id: string,
    @Body() body: { permissions: string[] },
    @Request() req,
  ) {
    return this.companyUsersService.updatePermissions(id, body.permissions, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa thành viên khỏi công ty' })
  @ApiParam({ name: 'id', description: 'ID thành viên' })
  @ApiResponse({
    status: 204,
    description: 'Xóa thành viên thành công',
  })
  async remove(@Param('id') id: string, @Request() req) {
    await this.companyUsersService.remove(id, req.user.id);
  }

  @Put(':id/deactivate')
  @ApiOperation({ summary: 'Vô hiệu hóa thành viên' })
  @ApiParam({ name: 'id', description: 'ID thành viên' })
  @ApiResponse({
    status: 200,
    description: 'Vô hiệu hóa thành công',
  })
  async deactivate(@Param('id') id: string, @Request() req) {
    return this.companyUsersService.deactivate(id, req.user.id);
  }

  @Put(':id/activate')
  @ApiOperation({ summary: 'Kích hoạt lại thành viên' })
  @ApiParam({ name: 'id', description: 'ID thành viên' })
  @ApiResponse({
    status: 200,
    description: 'Kích hoạt thành công',
  })
  async activate(@Param('id') id: string, @Request() req) {
    return this.companyUsersService.activate(id, req.user.id);
  }

  @Get('company/:companyId/statistics')
  @ApiOperation({ summary: 'Lấy thống kê thành viên công ty' })
  @ApiParam({ name: 'companyId', description: 'ID công ty' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thống kê thành công',
  })
  async getStatistics(@Param('companyId') companyId: string, @Request() req) {
    return this.companyUsersService.getStatistics(companyId, req.user.id);
  }
}