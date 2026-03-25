const prefixBlog = '/posts';
const prefixComment = '/blog-comment';

export const KEYS = {
  BLOG: prefixBlog,
  BLOG_SLUG: `${prefixBlog}`,
  BLOG_IMAGE: `${prefixBlog}/image`,
  BLOG_CREATE: `${prefixBlog}`,
  BLOG_DELETE: `${prefixBlog}/id`,
  BLOG_MY_BLOG: `${prefixBlog}/my-blog`,
  BLOG_WITH_COMMENT: `${prefixBlog}/blog-with-comment`,

  POST_COMMENT: `${prefixComment}`,
  POST_COMMENT_LIKE: `${prefixComment}/like`,
  POST_COMMENT_DISLIKE: `${prefixComment}/dislike`,
} as const;
