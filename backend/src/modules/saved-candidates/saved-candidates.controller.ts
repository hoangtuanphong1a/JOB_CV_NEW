import {
  Controller,
  Get,
  Post,
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
import { SavedCandidatesService } from './saved-candidates.service';
import { CreateSavedCandidateDto } from './dto/create-saved-candidate.dto';

@ApiTags('Saved Candidates - Lưu hồ sơ ứng viên')
@Controller('saved-candidates')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
export class SavedCandidatesController {
  constructor(
    private readonly savedCandidatesService: SavedCandidatesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Lưu hồ sơ ứng viên' })
  @ApiResponse({
    status: 201,
    description: 'Lưu hồ sơ thành công',
  })
  @ApiResponse({ status: 409, description: 'Đã lưu hồ sơ này rồi' })
  async save(@Body() createDto: CreateSavedCandidateDto, @Request() req) {
    return this.savedCandidatesService.save(createDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách ứng viên đã lưu' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'label', required: false, type: String })
  @ApiQuery({ name: 'isFavorite', required: false, type: Boolean })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách thành công',
  })
  async findAll(@Query() query: any, @Request() req) {
    return this.savedCandidatesService.findAll(req.user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin ứng viên đã lưu' })
  @ApiParam({ name: 'id', description: 'ID bản ghi' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin thành công',
  })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.savedCandidatesService.findOne(id, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Bỏ lưu ứng viên' })
  @ApiParam({ name: 'id', description: 'ID bản ghi' })
  @ApiResponse({
    status: 204,
    description: 'Bỏ lưu thành công',
  })
  async unsave(@Param('id') id: string, @Request() req) {
    await this.savedCandidatesService.unsave(id, req.user.id);
  }

  @Delete('candidate/:candidateId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Bỏ lưu ứng viên theo candidate ID' })
  @ApiParam({ name: 'candidateId', description: 'ID ứng viên' })
  @ApiResponse({
    status: 204,
    description: 'Bỏ lưu thành công',
  })
  async unsaveByCandidateId(
    @Param('candidateId') candidateId: string,
    @Request() req,
  ) {
    await this.savedCandidatesService.unsaveByCandidateId(
      candidateId,
      req.user.id,
    );
  }

  @Post('toggle/:candidateId')
  @ApiOperation({ summary: 'Toggle lưu/bỏ lưu ứng viên' })
  @ApiParam({ name: 'candidateId', description: 'ID ứng viên' })
  @ApiResponse({
    status: 200,
    description: 'Toggle thành công',
  })
  async toggleSave(@Param('candidateId') candidateId: string, @Request() req) {
    return this.savedCandidatesService.toggleSave(candidateId, req.user.id);
  }

  @Post(':id/favorite')
  @ApiOperation({ summary: 'Đánh dấu yêu thích' })
  @ApiParam({ name: 'id', description: 'ID bản ghi' })
  @ApiResponse({
    status: 200,
    description: 'Đánh dấu thành công',
  })
  async toggleFavorite(@Param('id') id: string, @Request() req) {
    return this.savedCandidatesService.toggleFavorite(id, req.user.id);
  }

  @Post(':id/label')
  @ApiOperation({ summary: 'Gắn nhãn phân loại' })
  @ApiParam({ name: 'id', description: 'ID bản ghi' })
  @ApiResponse({
    status: 200,
    description: 'Gắn nhãn thành công',
  })
  async updateLabel(
    @Param('id') id: string,
    @Body() body: { label: string },
    @Request() req,
  ) {
    return this.savedCandidatesService.updateLabel(id, body.label, req.user.id);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Cập nhật ghi chú' })
  @ApiParam({ name: 'id', description: 'ID bản ghi' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật ghi chú thành công',
  })
  async updateNotes(
    @Param('id') id: string,
    @Body() body: { notes: string },
    @Request() req,
  ) {
    return this.savedCandidatesService.updateNotes(id, body.notes, req.user.id);
  }

  @Get('check/:candidateId')
  @ApiOperation({ summary: 'Kiểm tra ứng viên đã lưu chưa' })
  @ApiParam({ name: 'candidateId', description: 'ID ứng viên' })
  @ApiResponse({
    status: 200,
    description: 'Kiểm tra thành công',
  })
  async checkSaved(@Param('candidateId') candidateId: string, @Request() req) {
    return this.savedCandidatesService.checkSaved(candidateId, req.user.id);
  }

  @Get('statistics/overview')
  @ApiOperation({ summary: 'Lấy thống kê ứng viên đã lưu' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thống kê thành công',
  })
  async getStatistics(@Request() req) {
    return this.savedCandidatesService.getStatistics(req.user.id);
  }
}
