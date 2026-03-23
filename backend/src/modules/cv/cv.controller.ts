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
import { CvService } from './cv.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@ApiTags('CVs')
@Controller('cvs')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new CV' })
  @ApiResponse({
    status: 201,
    description: 'CV created successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async create(@Body() createCvDto: CreateCvDto, @Request() req) {
    return this.cvService.create(createCvDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all CVs with filtering and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'visibility', required: false, type: String })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'CVs retrieved successfully',
  })
  async findAll(@Query() query: any) {
    return this.cvService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'CV ID' })
  @ApiOperation({ summary: 'Get CV by ID' })
  @ApiResponse({
    status: 200,
    description: 'CV retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'CV not found' })
  async findOne(@Param('id') id: string) {
    return this.cvService.findOne(id);
  }

  @Get('user/my-cvs')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user CVs' })
  @ApiResponse({
    status: 200,
    description: 'User CVs retrieved successfully',
  })
  async getMyCvs(@Request() req) {
    return this.cvService.findByUser(req.user.id);
  }

  @Get('public/:publicUrl')
  @ApiParam({ name: 'publicUrl', description: 'Public CV URL' })
  @ApiOperation({ summary: 'Get public CV by URL' })
  @ApiResponse({
    status: 200,
    description: 'Public CV retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'CV is not publicly accessible' })
  @ApiResponse({ status: 404, description: 'CV not found' })
  async getPublicCv(@Param('publicUrl') publicUrl: string) {
    return this.cvService.findPublicCv(publicUrl);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'CV ID' })
  @ApiOperation({ summary: 'Update CV' })
  @ApiResponse({
    status: 200,
    description: 'CV updated successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not CV owner' })
  @ApiResponse({ status: 404, description: 'CV not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCvDto: UpdateCvDto,
    @Request() req,
  ) {
    return this.cvService.update(id, updateCvDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'CV ID' })
  @ApiOperation({ summary: 'Delete CV' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'CV deleted successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not CV owner' })
  @ApiResponse({ status: 404, description: 'CV not found' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.cvService.remove(id, req.user.id);
  }

  @Post(':id/publish')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'CV ID' })
  @ApiOperation({ summary: 'Publish CV' })
  @ApiResponse({
    status: 200,
    description: 'CV published successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not CV owner or already published',
  })
  async publish(@Param('id') id: string, @Request() req) {
    return this.cvService.publishCv(id, req.user.id);
  }

  @Post(':id/archive')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'CV ID' })
  @ApiOperation({ summary: 'Archive CV' })
  @ApiResponse({
    status: 200,
    description: 'CV archived successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not CV owner' })
  async archive(@Param('id') id: string, @Request() req) {
    return this.cvService.archiveCv(id, req.user.id);
  }

  @Post(':id/share')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'CV ID' })
  @ApiOperation({ summary: 'Generate share link for CV' })
  @ApiResponse({
    status: 200,
    description: 'Share link generated successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not CV owner' })
  async share(@Param('id') id: string, @Request() req) {
    const publicUrl = await this.cvService.generateShareLink(id, req.user.id);
    return { publicUrl };
  }

  @Get('user/my-stats')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get CV statistics for current user' })
  @ApiResponse({
    status: 200,
    description: 'CV stats retrieved successfully',
  })
  async getMyStats(@Request() req) {
    return this.cvService.getCvStats(req.user.id);
  }

  @Post(':id/set-primary')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'CV ID' })
  @ApiOperation({ summary: 'Set CV as primary (default for applications)' })
  @ApiResponse({
    status: 200,
    description: 'CV set as primary successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not CV owner or CV not published',
  })
  async setPrimary(@Param('id') id: string, @Request() req) {
    return this.cvService.setPrimaryCv(id, req.user.id);
  }

  @Post(':id/unset-primary')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'CV ID' })
  @ApiOperation({ summary: 'Unset CV as primary' })
  @ApiResponse({
    status: 200,
    description: 'CV unset as primary successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not CV owner' })
  async unsetPrimary(@Param('id') id: string, @Request() req) {
    return this.cvService.unsetPrimaryCv(id, req.user.id);
  }

  @Get('user/primary-cv')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user primary CV' })
  @ApiResponse({
    status: 200,
    description: 'Primary CV retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'No primary CV found' })
  async getPrimaryCv(@Request() req) {
    const cv = await this.cvService.getPrimaryCv(req.user.id);
    if (!cv) {
      return { message: 'No primary CV set' };
    }
    return cv;
  }

  @Get('user/primary-cv-or-first')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get primary CV or first published CV for applications',
  })
  @ApiResponse({
    status: 200,
    description: 'CV for applications retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'No suitable CV found' })
  async getPrimaryCvOrFirst(@Request() req) {
    const cv = await this.cvService.getPrimaryCvOrFirst(req.user.id);
    if (!cv) {
      return { message: 'No published CV available for applications' };
    }
    return cv;
  }
}
