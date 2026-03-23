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
import { CompaniesService } from './companies.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({
    status: 201,
    description: 'Company created successfully',
  })
  @ApiResponse({ status: 409, description: 'Company name already exists' })
  async create(@Body() createCompanyDto: CreateCompanyDto, @Request() req) {
    return this.companiesService.create(createCompanyDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'industry', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Companies retrieved successfully',
  })
  async findAll(@Query() query: any) {
    return this.companiesService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiResponse({
    status: 200,
    description: 'Company retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiOperation({ summary: 'Update company' })
  @ApiResponse({
    status: 200,
    description: 'Company updated successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Request() req,
  ) {
    return this.companiesService.update(id, updateCompanyDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiOperation({ summary: 'Delete company' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Company deleted successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.companiesService.remove(id, req.user.id);
  }

  @Get('user/my-companies')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get companies owned by current user' })
  @ApiResponse({
    status: 200,
    description: 'User companies retrieved successfully',
  })
  async getMyCompanies(@Request() req) {
    return this.companiesService.findByOwner(req.user.id);
  }
}
