import { IPost } from '@/apis/client/blog/types';
import { CommentEntity } from '@/apis/client/comment/types';
import { LikeUser } from '@/apis/client/like/types';
import { INTERACTION_TYPES } from '@/lib/const';

// Ensure INTERACTION_TYPES is available
const INTERACTION_TYPES_SAFE = INTERACTION_TYPES || {
  POST: 'post',
  COMMENT: 'comment',
  LIKE: 'like',
};

// Define type using string literals to avoid runtime issues
export type InteractionType = 'post' | 'comment' | 'like';

export interface IInteractionNode {
  id: string;
  name: string;
  type: InteractionType;
  subRows?: IInteractionNode[];
  original?: IPost | CommentEntity | LikeUser;
  postId?: string;
  postTitle?: string;
}

// PostWithInteractions không extend IPost vì conflict với property 'likes' (IPost.likes là number, còn đây là LikeUser[])
export interface PostWithInteractions {
  // Copy các properties từ IPost nhưng override 'likes'
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_md: string;
  content_html: string;
  status: string;
  author_id: string;
  author: {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  tags: string[];
  views: number;
  comments_count?: number; // Số lượng comments (từ IPost.comments)
  likes_count?: number; // Số lượng likes (từ IPost.likes)
  reading_time: number;
  published_at: string | null;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string | null;
  image_url: string | null;
  // Thêm interactions
  comments?: CommentEntity[];
  likes?: LikeUser[];
}

/**
 * Build tree structure from posts with their interactions
 * Structure: Post -> Comments / Likes
 */
export function buildInteractionTree(
  posts: IPost[],
  commentsMap: Record<string, CommentEntity[]>,
  likesMap: Record<string, LikeUser[]>
): IInteractionNode[] {
  return posts.map((post) => {
    const postComments = commentsMap[post.id] || [];
    const postLikes = likesMap[post.id] || [];

    const subRows: IInteractionNode[] = [];

    // Add Comments section
    if (postComments.length > 0) {
      subRows.push({
        id: `comments-${post.id}`,
        name: `Bình luận (${postComments.length})`,
        type: INTERACTION_TYPES_SAFE.COMMENT,
        postId: post.id,
        postTitle: post.title,
        subRows: postComments.map((comment) => ({
          id: comment.id,
          name: `${comment.author?.full_name || 'Unknown'}: ${comment.content.substring(0, 50)}${comment.content.length > 50 ? '...' : ''}`,
          type: INTERACTION_TYPES_SAFE.COMMENT,
          original: comment,
          postId: post.id,
          postTitle: post.title,
        })),
      });
    }

    // Add Likes section
    if (postLikes.length > 0) {
      subRows.push({
        id: `likes-${post.id}`,
        name: `Lượt thích (${postLikes.length})`,
        type: INTERACTION_TYPES_SAFE.LIKE,
        postId: post.id,
        postTitle: post.title,
        subRows: postLikes.map((like) => ({
          id: `like-${like.user_id}-${post.id}`,
          name: `${like.full_name || 'Unknown'} - ${new Date(like.liked_at).toLocaleDateString('vi-VN')}`,
          type: INTERACTION_TYPES_SAFE.LIKE,
          original: like,
          postId: post.id,
          postTitle: post.title,
        })),
      });
    }

    return {
      id: post.id,
      name: post.title,
      type: INTERACTION_TYPES_SAFE.POST,
      original: post,
      subRows: subRows.length > 0 ? subRows : undefined,
    };
  });
}

