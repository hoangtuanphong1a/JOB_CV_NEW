import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Blog } from './blog.entity';
import { BlogTag } from './blog-tag.entity';

@Entity('blog_post_tags')
export class BlogPostTag {
  @PrimaryColumn({ name: 'blog_post_id' })
  blogPostId: string;

  @PrimaryColumn({ name: 'blog_tag_id' })
  blogTagId: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Relationships
  @ManyToOne(() => Blog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blog_post_id' })
  blogPost: Blog;

  @ManyToOne(() => BlogTag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blog_tag_id' })
  tag: BlogTag;

  // Helper methods
  get tagName(): string {
    return this.tag?.name || '';
  }

  get tagSlug(): string {
    return this.tag?.slug || '';
  }

  get tagColor(): string | null {
    return this.tag?.color || null;
  }
}
