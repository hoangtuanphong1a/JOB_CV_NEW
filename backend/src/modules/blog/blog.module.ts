import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { Blog } from '../common/entities/blog.entity';
import { BlogComment } from '../common/entities/blog-comment.entity';
import { BlogTag } from '../common/entities/blog-tag.entity';
import { BlogPostTag } from '../common/entities/blog-post-tag.entity';
import { User } from '../common/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, BlogComment, BlogTag, BlogPostTag, User]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
