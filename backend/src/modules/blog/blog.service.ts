import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog, BlogStatus } from '../common/entities/blog.entity';
import { BlogComment } from '../common/entities/blog-comment.entity';
import { User } from '../common/entities/user.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    @InjectRepository(BlogComment)
    private blogCommentRepository: Repository<BlogComment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createBlogDto: any, authorId: string): Promise<any> {
    const author = await this.userRepository.findOne({
      where: { id: authorId },
    });
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const slug = this.generateSlug(createBlogDto.title);
    const blog = this.blogRepository.create({
      ...createBlogDto,
      slug,
      authorId,
      status: BlogStatus.DRAFT,
    });

    const savedBlog = await this.blogRepository.save(blog);
    return savedBlog;
  }

  async findAll(query: any = {}): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, status = BlogStatus.PUBLISHED } = query;
    const skip = (page - 1) * limit;

    const [blogs, total] = await this.blogRepository.findAndCount({
      where: { status },
      relations: ['author'],
      order: { publishedAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: blogs,
      total,
      page: +page,
      limit: +limit,
    };
  }

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['author', 'comments'],
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async findBySlug(slug: string): Promise<Blog> {
    const blog = await this.blogRepository.findOne({
      where: { slug },
      relations: ['author', 'comments'],
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async update(
    id: string,
    updateBlogDto: any,
    authorId: string,
  ): Promise<Blog> {
    const blog = await this.blogRepository.findOne({
      where: { id, authorId },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (updateBlogDto.title && updateBlogDto.title !== blog.title) {
      updateBlogDto.slug = this.generateSlug(updateBlogDto.title);
    }

    await this.blogRepository.update(id, updateBlogDto);
    return this.findOne(id);
  }

  async remove(id: string, authorId: string): Promise<void> {
    const blog = await this.blogRepository.findOne({
      where: { id, authorId },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    await this.blogRepository.remove(blog);
  }

  async publish(id: string, authorId: string): Promise<Blog> {
    const blog = await this.blogRepository.findOne({
      where: { id, authorId },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    blog.publish();
    return this.blogRepository.save(blog);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // ===== COMMENT MANAGEMENT =====

  async createComment(
    blogId: string,
    createCommentDto: { content: string; parentId?: string },
    authorId: string,
  ): Promise<BlogComment> {
    // Verify blog exists
    const blog = await this.blogRepository.findOne({ where: { id: blogId } });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    // Verify author exists
    const author = await this.userRepository.findOne({
      where: { id: authorId },
    });
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    // Verify parent comment if provided
    let parent: BlogComment | undefined;
    if (createCommentDto.parentId) {
      parent =
        (await this.blogCommentRepository.findOne({
          where: { id: createCommentDto.parentId, blogId },
        })) || undefined;
      if (!parent) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    const comment = this.blogCommentRepository.create({
      content: createCommentDto.content,
      blogId,
      blog,
      authorId,
      author,
      parentId: createCommentDto.parentId,
      parent,
      isApproved: false, // Comments need admin approval before being visible
    });

    const savedComment = await this.blogCommentRepository.save(comment);

    // Load relations for return
    return this.blogCommentRepository.findOne({
      where: { id: savedComment.id },
      relations: ['blog', 'author', 'parent'],
    }) as Promise<BlogComment>;
  }

  async getCommentsForBlog(
    blogId: string,
    includeUnapproved: boolean = false,
  ): Promise<BlogComment[]> {
    const where: any = { blogId };

    if (!includeUnapproved) {
      where.isApproved = true;
    }

    const comments = await this.blogCommentRepository.find({
      where,
      relations: ['author', 'parent'],
      order: { createdAt: 'ASC' },
    });

    // Filter out replies from top level and structure as tree
    const topLevelComments = comments.filter((comment) => !comment.parentId);

    // Load replies for each top-level comment
    const commentsWithReplies = await Promise.all(
      topLevelComments.map(async (comment) => {
        const replies = await this.blogCommentRepository.find({
          where: { parentId: comment.id },
          relations: ['author', 'parent'],
          order: { createdAt: 'ASC' },
        });
        (comment as any).replies = replies;
        return comment;
      }),
    );

    return commentsWithReplies;
  }

  async updateComment(
    commentId: string,
    updateData: { content?: string },
    authorId: string,
  ): Promise<BlogComment> {
    const comment = await this.blogCommentRepository.findOne({
      where: { id: commentId },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== authorId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    // Only allow updates if comment is not approved yet
    if (comment.isApproved) {
      throw new ForbiddenException('Cannot update approved comments');
    }

    await this.blogCommentRepository.update(commentId, updateData);

    return this.blogCommentRepository.findOne({
      where: { id: commentId },
      relations: ['blog', 'author', 'parent'],
    }) as Promise<BlogComment>;
  }

  async deleteComment(commentId: string, authorId: string): Promise<void> {
    const comment = await this.blogCommentRepository.findOne({
      where: { id: commentId },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== authorId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    // Only allow deletion if comment is not approved yet
    if (comment.isApproved) {
      throw new ForbiddenException('Cannot delete approved comments');
    }

    await this.blogCommentRepository.remove(comment);
  }

  // ===== ADMIN MODERATION METHODS =====

  async approveComment(commentId: string): Promise<BlogComment> {
    const comment = await this.blogCommentRepository.findOne({
      where: { id: commentId },
      relations: ['blog', 'author', 'parent'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.isApproved) {
      throw new ForbiddenException('Comment is already approved');
    }

    comment.approve();
    return this.blogCommentRepository.save(comment);
  }

  async rejectComment(commentId: string, reason?: string): Promise<void> {
    const comment = await this.blogCommentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.isApproved) {
      throw new ForbiddenException('Cannot reject approved comments');
    }

    await this.blogCommentRepository.remove(comment);
  }

  async getPendingComments(): Promise<{
    data: BlogComment[];
    total: number;
  }> {
    const pendingComments = await this.blogCommentRepository.find({
      where: { isApproved: false },
      relations: ['blog', 'author', 'parent'],
      order: { createdAt: 'ASC' },
    });

    return {
      data: pendingComments,
      total: pendingComments.length,
    };
  }

  async getApprovedComments(query: any = {}): Promise<{
    data: BlogComment[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, blogId } = query;
    const skip = (page - 1) * limit;

    const where: any = { isApproved: true };
    if (blogId) {
      where.blogId = blogId;
    }

    const [comments, total] = await this.blogCommentRepository.findAndCount({
      where,
      relations: ['blog', 'author', 'parent'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: comments,
      total,
      page: +page,
      limit: +limit,
    };
  }

  async bulkApproveComments(
    commentIds: string[],
  ): Promise<{ approved: number; failed: number }> {
    let approved = 0;
    let failed = 0;

    for (const commentId of commentIds) {
      try {
        await this.approveComment(commentId);
        approved++;
      } catch (error) {
        failed++;
      }
    }

    return { approved, failed };
  }

  async bulkRejectComments(
    commentIds: string[],
  ): Promise<{ rejected: number; failed: number }> {
    let rejected = 0;
    let failed = 0;

    for (const commentId of commentIds) {
      try {
        await this.rejectComment(commentId);
        rejected++;
      } catch (error) {
        failed++;
      }
    }

    return { rejected, failed };
  }
}
