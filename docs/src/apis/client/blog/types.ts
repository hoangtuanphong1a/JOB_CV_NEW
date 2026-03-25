export interface IPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_md: string;
  content_html: string;
  status: string; // "published" | "draft"
  author_id: string;
  author: {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  reading_time: number;
  published_at: string | null; // ISO string
  scheduled_at: string | null; // ISO string
  created_at: string; // ISO string
  updated_at: string | null; // ISO string
  image_url: string | null;
}

export interface GetBlogsParams {
  tag?: string;
  author?: string;
  search?: string;
  post_status?: 'draft' | 'published' | 'archived';
  sort?: 'created_at' | 'published_at' | 'views' | 'likes';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PostListMeta {
  total_pages: number;
  current_page: number;
  items_per_page: number;
  total_items: number;
}

export interface PostListResponseData {
  data: IPost[];
  meta: PostListMeta;
}

export interface IComment {
  id: string;
  content: string;
  countLike: number;
  status: string;
  userId: string;
  author: string;
  avatar: string;
  createdAt: string;
  blogPostId: string;
  parentId?: string;
  replies: IComment[];
}

export interface ICommentRequest {
  content: string;
  blogPostId: string;
  parentId?: string;
  countLike: number;
  status: string;
  userId: string;
  author: string;
  createdAt: string;
}

export enum BlogStatus {
  PUBLISHED = 'Published',
  DRAFT = 'Draft',
}

export interface IPostRequest {
  title: string;
  body: string;
  excerpt: string;
  published: boolean;
  image: File;
  tags: string[];
}

export interface IPostUpdateRequest extends Omit<IPostRequest, 'IImage'> {
  Id: string;
  Image: string;
  IImage?: File;
}

export interface IMyPost {
  id: string;
  image: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  blogStatus: BlogStatus;
  createdAt: string;
}
