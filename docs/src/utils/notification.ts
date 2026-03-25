import { NotificationItem } from '@/apis/client/notice/types';

/**
 * Resolves the navigation link for a notification based on its type and data.
 * 
 * @param notification - The notification item
 * @returns The URL to navigate to, or undefined if no link can be resolved
 */
export const resolveNotificationLink = (notification: NotificationItem): string | undefined => {
  const { type, post_slug, post_id, ref_id } = notification;

  // For all post-related notifications (like, comment, reply), navigate to the post
  if (type === 'like' || type === 'comment' || type === 'reply') {
    // Use post_slug if available (preferred), otherwise fallback to post_id
    if (post_slug) {
      // For comment and reply notifications, add commentId query param to scroll to specific comment
      if ((type === 'comment' || type === 'reply') && ref_id) {
        return `/post/${post_slug}?commentId=${ref_id}`;
      }
      return `/post/${post_slug}`;
    }
    // Fallback: if we have post_id but no slug, we could fetch it
    // For now, return undefined to indicate we can't resolve the link
    if (post_id) {
      // In a production app, you might want to fetch the slug here
      // For now, we'll return undefined if slug is not available
      return undefined;
    }
    return undefined;
  }

  // For follow notifications, navigate to user profile
  if (type === 'follow') {
    return `/profile/${ref_id}`;
  }

  return undefined;
};

