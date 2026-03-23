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
import { BlogService } from './blog.service';
import { JwtGuard } from '../common/guards/jwt.guard';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({
    status: 201,
    description: 'Blog post created successfully',
  })
  async create(@Body() createBlogDto: any, @Request() req) {
    return this.blogService.create(createBlogDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog posts' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Blog posts retrieved successfully',
  })
  async findAll(@Query() query: any) {
    return this.blogService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Blog post ID' })
  @ApiOperation({ summary: 'Get blog post by ID' })
  @ApiResponse({
    status: 200,
    description: 'Blog post retrieved successfully',
  })
  async findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiParam({ name: 'slug', description: 'Blog post slug' })
  @ApiOperation({ summary: 'Get blog post by slug' })
  @ApiResponse({
    status: 200,
    description: 'Blog post retrieved successfully',
  })
  async findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Blog post ID' })
  @ApiOperation({ summary: 'Update blog post' })
  @ApiResponse({
    status: 200,
    description: 'Blog post updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: any,
    @Request() req,
  ) {
    return this.blogService.update(id, updateBlogDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Blog post ID' })
  @ApiOperation({ summary: 'Delete blog post' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Blog post deleted successfully',
  })
  async remove(@Param('id') id: string, @Request() req) {
    await this.blogService.remove(id, req.user.id);
  }

  @Post(':id/publish')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'Blog post ID' })
  @ApiOperation({ summary: 'Publish blog post' })
  @ApiResponse({
    status: 200,
    description: 'Blog post published successfully',
  })
  async publish(@Param('id') id: string, @Request() req) {
    return this.blogService.publish(id, req.user.id);
  }
}
