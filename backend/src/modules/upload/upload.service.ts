import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { promises as fs } from 'fs';
import { join } from 'path';
import { File, FileType } from './entities/file.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    fileType: FileType,
    uploadedById: string,
    isPublic = false,
    altText?: string,
    description?: string,
  ): Promise<File> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const fileEntity = this.fileRepository.create({
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      fileType,
      path: file.path,
      url: `/uploads/${file.filename}`,
      uploadedById,
      isPublic,
      altText,
      description,
    });

    return this.fileRepository.save(fileEntity);
  }

  async getFileById(id: string): Promise<File> {
    const file = await this.fileRepository.findOne({
      where: { id },
      relations: ['uploadedBy'],
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async getFilesByUser(userId: string, fileType?: FileType): Promise<File[]> {
    const query = this.fileRepository
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.uploadedBy', 'uploadedBy')
      .where('file.uploadedById = :userId', { userId });

    if (fileType) {
      query.andWhere('file.fileType = :fileType', { fileType });
    }

    return query.orderBy('file.createdAt', 'DESC').getMany();
  }

  async getPublicFiles(fileType?: FileType): Promise<File[]> {
    const query = this.fileRepository
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.uploadedBy', 'uploadedBy')
      .where('file.isPublic = :isPublic', { isPublic: true });

    if (fileType) {
      query.andWhere('file.fileType = :fileType', { fileType });
    }

    return query.orderBy('file.createdAt', 'DESC').getMany();
  }

  async deleteFile(id: string, userId: string): Promise<void> {
    const file = await this.fileRepository.findOne({
      where: { id, uploadedById: userId },
    });

    if (!file) {
      throw new NotFoundException('File not found or access denied');
    }

    // Delete physical file
    try {
      await fs.unlink(join(process.cwd(), 'uploads', file.filename));
    } catch (error) {
      // File might not exist, continue with database deletion
      console.warn(`Could not delete physical file: ${file.filename}`);
    }

    // Delete database record
    await this.fileRepository.remove(file);
  }

  async updateFileMetadata(
    id: string,
    userId: string,
    updates: Partial<Pick<File, 'altText' | 'description' | 'isPublic'>>,
  ): Promise<File> {
    const file = await this.fileRepository.findOne({
      where: { id, uploadedById: userId },
    });

    if (!file) {
      throw new NotFoundException('File not found or access denied');
    }

    await this.fileRepository.update(id, updates);

    return this.getFileById(id);
  }

  async getFileStats(userId: string): Promise<{
    totalFiles: number;
    totalSize: number;
    filesByType: Record<FileType, number>;
  }> {
    const files = await this.fileRepository.find({
      where: { uploadedById: userId },
    });

    const stats = {
      totalFiles: files.length,
      totalSize: files.reduce((sum, file) => sum + Number(file.size), 0),
      filesByType: {} as Record<FileType, number>,
    };

    // Count files by type
    Object.values(FileType).forEach((type) => {
      stats.filesByType[type] = files.filter((f) => f.fileType === type).length;
    });

    return stats;
  }
}
