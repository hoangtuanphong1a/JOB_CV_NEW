const postsPrefix = '/posts';

export const KEYS = {
  LIKE_SUMMARY: 'post-like-summary',
  LIKE_LIST: 'post-like-list',
  likeActionPath: (postId: string) => `${postsPrefix}/${postId}/like`,
  likesListPath: (postId: string) => `${postsPrefix}/${postId}/likes`,
} as const;


