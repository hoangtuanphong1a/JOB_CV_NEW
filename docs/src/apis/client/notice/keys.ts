const notificationsPrefix = '/notifications';

export const KEYS = {
  LIST: 'notifications-list',
  UNREAD_COUNT: 'notifications-unread-count',
  MARK_READ: 'notification-mark-read',
  MARK_UNREAD: 'notification-mark-unread',
  MARK_ALL_READ: 'notifications-mark-all-read',
  listPath: notificationsPrefix,
  unreadCountPath: `${notificationsPrefix}/unread-count`,
  markReadPath: (id: string) => `${notificationsPrefix}/${id}/read`,
  markUnreadPath: (id: string) => `${notificationsPrefix}/${id}/unread`,
  markAllReadPath: `${notificationsPrefix}/read-all`,
} as const;


