import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../common/guards/jwt.guard';
import { UploadService } from './upload.service';
import { File, FileType } from './entities/file.entity';

class UploadFileDto {
  fileType: FileType;
  isPublic?: boolean;
  altText?: string;
  description?: string;
}

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
        fileType: {
          type: 'string',
          enum: Object.values(FileType),
          description: 'Type of file being uploaded',
        },
        isPublic: {
          type: 'boolean',
          description: 'Whether the file is publicly accessible',
          default: false,
        },
        altText: {
          type: 'string',
          description: 'Alt text for images',
        },
        description: {
          type: 'string',
          description: 'File description',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: File,
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadFileDto,
    @Request() req: any,
  ): Promise<File> {
    const { fileType, isPublic, altText, description } = body;
    return this.uploadService.uploadFile(
      file,
      fileType,
      req.user.id,
      isPublic || false,
      altText,
      description,
    );
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Avatar upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image file',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Avatar uploaded successfully',
    type: File,
  })
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ): Promise<File> {
    return this.uploadService.uploadFile(
      file,
      FileType.AVATAR,
      req.user.id,
      true, // avatars are public
    );
  }

  @Post('company-logo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload company logo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Company logo upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Company logo image file',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Company logo uploaded successfully',
    type: File,
  })
  async uploadCompanyLogo(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ): Promise<File> {
    return this.uploadService.uploadFile(
      file,
      FileType.COMPANY_LOGO,
      req.user.id,
      true, // company logos are public
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get user files' })
  @ApiResponse({
    status: 200,
    description: 'User files retrieved successfully',
    type: [File],
  })
  async getUserFiles(@Request() req: any): Promise<File[]> {
    return this.uploadService.getFilesByUser(req.user.id);
  }

  @Get('public')
  @UseGuards() // Remove JwtGuard to make this endpoint public
  @ApiOperation({ summary: 'Get public files' })
  @ApiResponse({
    status: 200,
    description: 'Public files retrieved successfully',
    type: [File],
  })
  async getPublicFiles(): Promise<File[]> {
    return this.uploadService.getPublicFiles();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiOperation({ summary: 'Get file by ID' })
  @ApiResponse({
    status: 200,
    description: 'File retrieved successfully',
    type: File,
  })
  @ApiResponse({ status: 404, description: 'File not found' })
  async getFile(@Param('id') id: string): Promise<File> {
    return this.uploadService.getFileById(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiOperation({ summary: 'Update file metadata' })
  @ApiBody({
    description: 'File metadata update',
    schema: {
      type: 'object',
      properties: {
        altText: {
          type: 'string',
          description: 'Alt text for images',
        },
        description: {
          type: 'string',
          description: 'File description',
        },
        isPublic: {
          type: 'boolean',
          description: 'Whether the file is publicly accessible',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'File metadata updated successfully',
    type: File,
  })
  @ApiResponse({ status: 404, description: 'File not found' })
  async updateFile(
    @Param('id') id: string,
    @Body()
    updates: Partial<Pick<File, 'altText' | 'description' | 'isPublic'>>,
    @Request() req: any,
  ): Promise<File> {
    return this.uploadService.updateFileMetadata(id, req.user.id, updates);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'File ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete file' })
  @ApiResponse({
    status: 204,
    description: 'File deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'File not found' })
  async deleteFile(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<void> {
    return this.uploadService.deleteFile(id, req.user.id);
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Get file upload statistics' })
  @ApiResponse({
    status: 200,
    description: 'File statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalFiles: { type: 'number' },
        totalSize: { type: 'number' },
        filesByType: {
          type: 'object',
          additionalProperties: { type: 'number' },
        },
      },
    },
  })
  async getFileStats(@Request() req: any): Promise<{
    totalFiles: number;
    totalSize: number;
    filesByType: Record<FileType, number>;
  }> {
    return this.uploadService.getFileStats(req.user.id);
  }
}
