import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { CV } from '../common/entities/cv.entity';
import { User } from '../common/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CV, User])],
  controllers: [CvController],
  providers: [CvService],
  exports: [CvService],
})
export class CvModule {}
