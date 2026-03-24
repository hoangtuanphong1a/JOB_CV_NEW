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
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@ApiTags('Branches - Quản lý chi nhánh')
@Controller('branches')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo chi nhánh mới' })
  @ApiResponse({
    status: 201,
    description: 'Tạo chi nhánh thành công',
  })
  @ApiResponse({ status: 403, description: 'Không có quyền tạo chi nhánh' })
  async create(@Body() createBranchDto: CreateBranchDto, @Request() req) {
    return this.branchesService.create(createBranchDto, req.user.id);
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Lấy danh sách chi nhánh theo công ty' })
  @ApiParam({ name: 'companyId', description: 'ID công ty' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách chi nhánh thành công',
  })
  async findAllByCompany(
    @Param('companyId') companyId: string,
    @Query() query: any,
    @Request() req,
  ) {
    return this.branchesService.findAllByCompany(companyId, req.user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi nhánh theo ID' })
  @ApiParam({ name: 'id', description: 'ID chi nhánh' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin chi nhánh thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chi nhánh' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.branchesService.findOne(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin chi nhánh' })
  @ApiParam({ name: 'id', description: 'ID chi nhánh' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật chi nhánh thành công',
  })
  @ApiResponse({ status: 403, description: 'Không có quyền cập nhật' })
  async update(
    @Param('id') id: string,
    @Body() updateBranchDto: UpdateBranchDto,
    @Request() req,
  ) {
    return this.branchesService.update(id, updateBranchDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa chi nhánh' })
  @ApiParam({ name: 'id', description: 'ID chi nhánh' })
  @ApiResponse({
    status: 204,
    description: 'Xóa chi nhánh thành công',
  })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa' })
  async remove(@Param('id') id: string, @Request() req) {
    await this.branchesService.remove(id, req.user.id);
  }

  @Put(':id/set-headquarter')
  @ApiOperation({ summary: 'Đặt chi nhánh làm trụ sở chính' })
  @ApiParam({ name: 'id', description: 'ID chi nhánh' })
  @ApiResponse({
    status: 200,
    description: 'Đặt trụ sở chính thành công',
  })
  async setAsHeadquarter(@Param('id') id: string, @Request() req) {
    return this.branchesService.setAsHeadquarter(id, req.user.id);
  }

  @Put(':id/toggle-status')
  @ApiOperation({ summary: 'Bật/tắt trạng thái hoạt động của chi nhánh' })
  @ApiParam({ name: 'id', description: 'ID chi nhánh' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật trạng thái thành công',
  })
  async toggleStatus(@Param('id') id: string, @Request() req) {
    return this.branchesService.toggleStatus(id, req.user.id);
  }

  @Get('company/:companyId/statistics')
  @ApiOperation({ summary: 'Lấy thống kê chi nhánh theo công ty' })
  @ApiParam({ name: 'companyId', description: 'ID công ty' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thống kê thành công',
  })
  async getStatistics(@Param('companyId') companyId: string, @Request() req) {
    return this.branchesService.getStatistics(companyId, req.user.id);
  }
}