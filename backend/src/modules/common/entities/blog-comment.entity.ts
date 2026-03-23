import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Blog } from './blog.entity';

@Entity('blog_comments')
export class BlogComment extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'blog_id' })
  blogId: string;

  @ManyToOne(() => Blog, (blog) => blog.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;

  @Column({ name: 'author_id' })
  authorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'parent_id', nullable: true })
  parentId?: string;

  @ManyToOne(() => BlogComment, (comment) => comment.replies, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: BlogComment;

  @OneToMany(() => BlogComment, (comment) => comment.parent)
  replies: BlogComment[];

  @Column({ type: 'int', default: 0 })
  likeCount: number;

  @Column({ type: 'boolean', default: false })
  isApproved: boolean;

  incrementLikeCount(): void {
    this.likeCount += 1;
  }

  decrementLikeCount(): void {
    this.likeCount = Math.max(0, this.likeCount - 1);
  }

  approve(): void {
    this.isApproved = true;
  }
}
