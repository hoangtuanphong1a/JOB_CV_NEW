import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BlogPostTag } from './blog-post-tag.entity';

@Entity('blog_tags')
export class BlogTag extends BaseEntity {
  @Column({ unique: true })
  name: string; // Tên tag (ví dụ: "React", "JavaScript", "Career Advice")

  @Column({ nullable: true })
  slug?: string; // URL-friendly version (ví dụ: "react", "javascript")

  @Column({ type: 'text', nullable: true })
  description?: string; // Mô tả về tag này

  @Column({ type: 'int', default: 0 })
  usageCount: number; // Số lần tag được sử dụng

  @Column({ nullable: true })
  color?: string; // Màu sắc cho tag (hex code)

  @Column({ type: 'boolean', default: true })
  isActive: boolean; // Tag có đang được sử dụng không

  // Relationships
  @OneToMany(() => BlogPostTag, (blogPostTag) => blogPostTag.tag)
  blogPostTags: BlogPostTag[];

  // Helper methods
  get postCount(): number {
    return this.blogPostTags?.length || 0;
  }

  incrementUsage(): void {
    this.usageCount++;
  }

  decrementUsage(): void {
    if (this.usageCount > 0) {
      this.usageCount--;
    }
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  get isPopular(): boolean {
    return this.usageCount >= 10;
  }

  // Auto-generate slug if not provided
  generateSlug(): void {
    if (!this.slug && this.name) {
      this.slug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
    }
  }
}
