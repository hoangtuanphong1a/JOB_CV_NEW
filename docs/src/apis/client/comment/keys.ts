const postsPrefix = '/posts';
const commentsPrefix = '/comments';

export const KEYS = {
  COMMENT_QUERY_KEY: 'post-comments',
  postCommentsPath: (postId: string) => `${postsPrefix}/${postId}/comments`,
  commentPath: (commentId: string) => `${commentsPrefix}/${commentId}`,
} as const;


