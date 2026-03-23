import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { BlogComment } from './blog-comment.entity';

export enum BlogStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('blogs')
export class Blog extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  excerpt?: string;

  @Column({ nullable: true })
  featuredImage?: string;

  @Column({
    type: 'varchar',
    default: BlogStatus.DRAFT,
  })
  status: BlogStatus;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'author_id' })
  authorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ type: 'simple-json', nullable: true })
  tags?: string[];

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  likeCount: number;

  @Column({ type: 'int', default: 0 })
  commentCount: number;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'datetime', nullable: true })
  publishedAt?: Date;

  @Column({ type: 'json', nullable: true })
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };

  @OneToMany(() => BlogComment, (comment) => comment.blog)
  comments: BlogComment[];

  get readingTime(): number {
    // Estimate reading time (200 words per minute)
    const wordsPerMinute = 200;
    const words = this.content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  }

  get url(): string {
    return `/blog/${this.slug}`;
  }

  publish(): void {
    this.status = BlogStatus.PUBLISHED;
    this.publishedAt = new Date();
  }

  incrementViewCount(): void {
    this.viewCount += 1;
  }

  incrementLikeCount(): void {
    this.likeCount += 1;
  }

  decrementLikeCount(): void {
    this.likeCount = Math.max(0, this.likeCount - 1);
  }

  updateCommentCount(): void {
    // This would typically be updated based on comments count
    // For now, we'll just use the comments relation
  }
}
